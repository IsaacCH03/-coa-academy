import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/courses'

export default function CourseAvailabilityLayout({ children }: { children: ReactNode }) {
  const course = getCourse('programacion-con-ia')
  if (!course || course.comingSoon) notFound()
  return children
}