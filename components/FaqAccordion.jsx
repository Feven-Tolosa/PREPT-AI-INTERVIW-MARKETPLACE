'use client'

import { useState } from 'react'
import { SectionLabel, SectionHeading } from '@/components/reusables'
import { FAQ_ITEMS } from '@/lib/data'
import { ChevronDown } from 'lucide-react'

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div
      className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'bg-white/5 backdrop-blur-xl border-amber-400/20 shadow-[0_0_40px_-12px_rgba(251,191,36,0.15)]'
          : 'bg-white/2 backdrop-blur-sm border-white/10 hover:border-white/20'
      }`}
    >
      <button
        onClick={onToggle}
        className='w-full flex items-center justify-between gap-4 px-7 py-6 text-left cursor-pointer'
      >
        <span
          className={`font-serif text-base tracking-tight transition-colors duration-200 ${
            isOpen
              ? 'text-stone-100'
              : 'text-stone-300 group-hover:text-stone-100'
          }`}
        >
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-stone-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className='overflow-hidden'>
          <p className='px-7 pb-6 text-sm text-stone-400 leading-relaxed'>
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className='relative z-10 py-28 max-w-3xl mx-auto px-6'>
      <div className='text-center mb-16'>
        <SectionLabel>FAQ</SectionLabel>
        <SectionHeading gray='Got questions?' gold="We've got answers" />
      </div>

      <div className='space-y-3'>
        {FAQ_ITEMS.map((item, i) => (
          <FaqItem
            key={i}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  )
}
