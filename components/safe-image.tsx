'use client'
import Image from 'next/image'
import { useState } from 'react'
export function SafeImage({src,alt,sizes,className}:{src:string;alt:string;sizes:string;className?:string}){
  const[current,setCurrent]=useState(src||'/placeholder.svg')
  return <Image src={current} alt={alt} fill sizes={sizes} className={className} onError={()=>setCurrent('/placeholder.svg')}/>
}
