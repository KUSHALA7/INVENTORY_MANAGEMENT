"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Item } from "../types/item"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAddItem: (item: Omit<Item, "id" | "lastUpdated">) => void
  existingItems: Item[]
}

export function AddItemModal({ isOpen, onClose, onAddItem, existingItems }: AddItemModalProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !category || !quantity || !unitPrice) {
      setError("All fields are required")
      return
    }

    if (existingItems.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      setError("An item with this name already exists")
      return
    }

    const newItem: Omit<Item, "id" | "lastUpdated"> = {
      name,
      category,
      quantity: Number.parseInt(quantity),
      unitPrice: Number.parseFloat(unitPrice),
    }

    onAddItem(newItem)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setCategory("")
    setQuantity("")
    setUnitPrice("")
    setError(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Input placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Unit Price"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
              />
              {error && <p className="text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Add Item
              </Button>
            </motion.form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

