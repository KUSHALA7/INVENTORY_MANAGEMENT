"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditItemModal } from "./EditItemModal"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"
import type { Item } from "../types/item"

interface InventoryTableProps {
  items: Item[]
  onUpdateItem: (item: Item) => void
  onDeleteItem: (id: string) => void
}

export function InventoryTable({ items, onUpdateItem, onDeleteItem }: InventoryTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Item>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)

  const itemsPerPage = 10

  const filteredItems = items
    .filter((item) => (filterCategory === "all" ? true : item.category === filterCategory))
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const paginatedItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)

  const handleSort = (column: keyof Item) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-card dark:bg-card/50 backdrop-blur-lg rounded-lg shadow-lg p-6"
    >
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Clothing">Clothing</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                Item Name {sortColumn === "name" && (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead onClick={() => handleSort("quantity")} className="cursor-pointer">
                Quantity {sortColumn === "quantity" && (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead onClick={() => handleSort("unitPrice")} className="cursor-pointer">
                Unit Price {sortColumn === "unitPrice" && (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedItems.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`animate-in hover:bg-muted/50 ${item.quantity < 10 ? "blink-red" : ""}`}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className={item.quantity < 10 ? "text-destructive font-bold" : ""}>
                    {item.quantity}
                  </TableCell>
                  <TableCell>₹{item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{new Date(item.lastUpdated).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingItemId(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedItems.length)}{" "}
          of {sortedItems.length} items
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
      {editingItem && (
        <EditItemModal
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onUpdateItem={onUpdateItem}
          existingItems={items}
        />
      )}
      <DeleteConfirmationDialog
        isOpen={!!deletingItemId}
        onClose={() => setDeletingItemId(null)}
        onConfirm={() => {
          if (deletingItemId) {
            onDeleteItem(deletingItemId)
            setDeletingItemId(null)
          }
        }}
      />
    </motion.div>
  )
}

