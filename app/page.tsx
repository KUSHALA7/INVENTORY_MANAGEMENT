"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { InventoryTable } from "../components/InventoryTable"
import { AddItemModal } from "../components/AddItemModal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { Item } from "../types/item"
import { generateId } from "../utils/generateId"
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorage"
import { ThemeToggle } from "../components/ThemeToggle"
import { PlusCircle } from "lucide-react"

export default function InventoryManagementSystem() {
  const [items, setItems] = useState<Item[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedItems = loadFromLocalStorage("inventoryItems")
    if (savedItems) {
      setItems(savedItems)
    }
  }, [])

  const addItem = (newItem: Omit<Item, "id" | "lastUpdated">) => {
    const itemWithId: Item = {
      ...newItem,
      id: generateId(),
      lastUpdated: new Date().toISOString(),
    }
    const updatedItems = [...items, itemWithId]
    setItems(updatedItems)
    saveToLocalStorage("inventoryItems", updatedItems)
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to the inventory.`,
    })
  }

  const updateItem = (updatedItem: Item) => {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? { ...updatedItem, lastUpdated: new Date().toISOString() } : item,
    )
    setItems(updatedItems)
    saveToLocalStorage("inventoryItems", updatedItems)
    toast({
      title: "Item Updated",
      description: `${updatedItem.name} has been updated.`,
    })
  }

  const deleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    saveToLocalStorage("inventoryItems", updatedItems)
    toast({
      title: "Item Deleted",
      description: "The item has been removed from the inventory.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 dark:from-background dark:to-secondary/5">
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Inventory Management System
          </h1>
          <ThemeToggle />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="mb-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Item
          </Button>
        </motion.div>
        <AnimatePresence>
          {items.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <InventoryTable items={items} onUpdateItem={updateItem} onDeleteItem={deleteItem} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-500 mt-8"
            >
              No items in inventory. Add some items to get started!
            </motion.div>
          )}
        </AnimatePresence>
        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={addItem}
          existingItems={items}
        />
      </div>
    </div>
  )
}

