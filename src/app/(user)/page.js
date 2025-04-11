import React from 'react'
import CategorySection from './components/category/CategorySection'
import Subcategory from './components/subcategory/SubcategorySection'
import HeroSection from './components/home/heroSection'
import Services from './components/services/services'
import About from './components/miniaboutSections/aboutUs'
import WeOffer from './components/miniaboutSections/weoffer'
import ChooseUs from './components/miniaboutSections/chooseus'


export default function page() {
  return (
    <div>
        <HeroSection/>
        <CategorySection/>
        <Subcategory/>
        <About/>
        <WeOffer/>
        <ChooseUs/>
        <Services/>
        
    </div>
  )
}
