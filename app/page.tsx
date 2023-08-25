'use client'

import Image from 'next/image'
import { CarCard, CustomFilter, Hero, Searchbar } from '@/components'
import { fetchCars } from '@/utils'
import { fuels, yearsOfProduction } from '@/constants'
import ShowMore from '@/components/ShowMore'
import { useState, useEffect } from 'react'

export default function Home() {
  // const allCars = await fetchCars({ 
  //   manufacturer: searchParams?.manufacturer || '',
  //   year: searchParams?.year || 2022,
  //   model: searchParams?.year || '',
  //   fuel: searchParams?.fuel || '',
  //   limit: searchParams?.limit || 10, 
  // })

  const [allCars, setAllCars] = useState([])
  const [loading, setLoading] = useState(false)

  //Search states
  const[manufacturer, setManufacturer] = useState('')
  const[model, setModel] = useState('')

  //FIlter states
  const[fuel, setFuel] = useState('')
  const[year, setYear] = useState(2022)

  //Pagination states
  const[limit, setLimit] = useState(10)

  const getCars = async () => {
    setLoading(true)

    try {
      const result = await fetchCars({ 
        manufacturer: manufacturer || '',
        year: year || 2022,
        model: model || '',
        fuel: fuel || '',
        limit: limit || 10, 
      });
  
      setAllCars(result)
  
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    console.log(fuel, year, manufacturer, model, limit);
    
    getCars()
  },[manufacturer, model, fuel, year, limit])

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars

  
  


  return (
    <main className="overflow-hidden ">
     <Hero />

     <div className="mt-12 padding-x padding-y max-width" id='discover'>
      <div className="home__text-container">
        <h1 className='text-4xl font-extrabold'>Car catalogue</h1>
        <p>Explore the cars you might like</p>
      </div>
      <div className="home__filters">
        <Searchbar setManufacturer={setManufacturer} setModel={setModel}/>
        <div className='home__filter-container'>
          <CustomFilter title="fuel" options={fuels} setFilter={setFuel}/>
          <CustomFilter title="year" options={ yearsOfProduction } setFilter={setYear}/>
        </div>
      </div>

      { allCars.length > 0 ? (
        <section>
          <div className="home__cars-wrapper">
            {allCars?.map((car) => (
              <CarCard
                car={car}
              />
            ))}
          </div>

          {loading && (
            <div className='mt-16 w-full flex-center'>
              <Image src='/loader.svg' width={100} height={100} alt='loader' className='object-contain'/>
            </div>
          )}

          <ShowMore
            pageNumber ={ limit  / 10 }
            isNext = { limit > allCars?.length }
            setLimit = { setLimit }
          />
        </section>
        ):(
          <div className='home__error-container'>
            <h2 className='text-black text-xl font-bold'>Oops, no ersults</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  )
}
