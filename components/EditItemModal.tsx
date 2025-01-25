"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Item } from "../types/item"

interface EditItemModalProps {
  item: Item
  isOpen: boolean
  onClose: () => void
  onUpdateItem: (item: Item) => void
  existingItems: Item[]
}

export function EditItemModal({ item, isOpen, onClose, onUpdateItem, existingItems }: EditItemModalProps) {
  const [name, setName] = useState(item.name)
  const [category, setCategory] = useState(item.category)
  const [quantity, setQuantity] = useState(item.quantity.toString())
  const [unitPrice, setUnitPrice] = useState(item.unitPrice.toString())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(item.name)
    setCategory(item.category)
    setQuantity(item.quantity.toString())
    setUnitPrice(item.unitPrice.toString())
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !category || !quantity || !unitPrice) {
      setError("All fields are required")
      return
    }

    if (
      name.toLowerCase() !== item.name.toLowerCase() &&
      existingItems.some((existingItem) => existingItem.name.toLowerCase() === name.toLowerCase())
    ) {
      setError("An item with this name already exists")
      return
    }

    const updatedItem: Item = {
      ...item,
      name,
      category,
      quantity: Number.parseInt(quantity),
      unitPrice: Number.parseFloat(unitPrice),
    }

    onUpdateItem(updatedItem)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
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
                Update Item
              </Button>
            </motion.form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

