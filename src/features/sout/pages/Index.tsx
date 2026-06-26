'use client'

import Header from '@sout/components/layout/Header'
import Footer from '@sout/components/layout/Footer'
import HeroSection from '@sout/components/home/HeroSection'
import StatsSection from '@sout/components/home/StatsSection'
import SoutDbCoursesSection from '@sout/components/courses/SoutDbCoursesSection'
import ServicesSection from '@sout/components/home/ServicesSection'
import HistorySection from '@sout/components/home/HistorySection'
import TestimonialsSection from '@sout/components/home/TestimonialsSection'
import CTASection from '@sout/components/home/CTASection'
import ClientsMarquee from '@sout/components/home/ClientsMarquee'
import type { PublicCourse } from '@sout/lib/getPublicCourses'

type Props = {
  courses?: PublicCourse[]
}

const Index = ({ courses = [] }: Props) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <SoutDbCoursesSection courses={courses} limit={3} />
        <ServicesSection />
        <HistorySection />
        <TestimonialsSection />
        <CTASection />
        <ClientsMarquee />
      </main>
      <Footer />
    </div>
  )
}

export default Index

