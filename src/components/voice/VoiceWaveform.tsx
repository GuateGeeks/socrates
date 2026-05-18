'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface VoiceWaveformProps {
  isActive: boolean
}

const BAR_COUNT = 5

const barVariants = {
  hidden: { scaleY: 0.15, opacity: 0 },
  visible: (index: number) => ({
    scaleY: [0.15, 1, 0.4, 0.8, 0.25, 0.9, 0.15],
    opacity: 1,
    transition: {
      scaleY: {
        duration: 1.4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.15,
        times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
      },
      opacity: {
        duration: 0.2,
      },
    },
  }),
  exit: {
    scaleY: 0.15,
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export function VoiceWaveform({ isActive }: VoiceWaveformProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="waveform"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="presentation"
          aria-hidden="true"
          className="flex items-center justify-center gap-[4px]"
          style={{ height: '48px' }}
        >
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={barVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="block rounded-full bg-brand-400"
              style={{
                width: '4px',
                height: '48px',
                transformOrigin: 'center',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
