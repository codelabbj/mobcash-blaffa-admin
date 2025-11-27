"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface NotesDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (notes: string) => void
  title: string
  description?: string
  action: "approve" | "reject"
  isLoading?: boolean
}

export function NotesDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  action,
  isLoading = false,
}: NotesDialogProps) {
  const [notes, setNotes] = useState("")
  const isRequired = action === "reject"

  const handleSubmit = () => {
    if (isRequired && !notes.trim()) {
      return
    }
    onSubmit(notes)
    setNotes("")
  }

  const handleClose = () => {
    setNotes("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes {isRequired && <span className="text-destructive">*</span>}
            </label>
            <Textarea
              id="notes"
              placeholder={
                isRequired
                  ? "Veuillez fournir une raison pour le rejet..."
                  : "Ajouter des notes (optionnel)..."
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-28"
            />
            {isRequired && !notes.trim() && (
              <p className="text-xs text-destructive">Les notes sont requises pour rejeter</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (isRequired && !notes.trim())}
            variant={action === "reject" ? "destructive" : "default"}
          >
            {isLoading ? "Traitement..." : action === "approve" ? "Approuver" : "Rejeter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}