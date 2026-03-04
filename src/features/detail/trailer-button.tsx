'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export const TrailerButton = ({ trailerKey, label }: { trailerKey: string; label: string }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="lg" onClick={() => setOpen(true)} className="gap-2">
        <Play className="h-5 w-5 fill-current" />
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 bg-black border-border overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
