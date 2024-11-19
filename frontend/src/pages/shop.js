import React from 'react'
import Hero from '../components/Hero/Hero';
import Popular from '../components/popular/popular';
import Offers from '../components/offers/offers';
import NewCollections from '../components/NewCollections/NewCollections';
import Newsletter from '../components/newsletter/newsletter';

const shop = () => {
  return (
    <div>
        <Hero/>
        <Popular/>
        <Offers/>
        <NewCollections/>
        <Newsletter/>
    </div>
  )
}

export default shop
