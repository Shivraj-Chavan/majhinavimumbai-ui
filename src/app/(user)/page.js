"use client"
import React, { useEffect } from 'react'
import CategorySection from './components/category/CategorySection'
import Subcategory from './components/subcategory/SubcategorySection'
import HeroSection from './components/home/heroSection'
import Services from './components/services/services'
import About from './components/miniaboutSections/aboutUs'
import WeOffer from './components/miniaboutSections/weoffer'
import ChooseUs from './components/miniaboutSections/chooseus'
import { useDispatch } from 'react-redux'
import { fetchCategories } from '@/redux/slice/categoriesSlice'

export default function Page() {
      const dispatch = useDispatch();
  
      useEffect(() => {
        console.log('Dispatching fetchCategories');
        dispatch(fetchCategories());
      }, [dispatch]);
  
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
