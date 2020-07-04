import React, {Component} from 'react'
import {isEmpty} from "Utils"
const store = {}
export function setCategories(categories){
  store.categories = categories
  console.log("setcategories", store.categories)
}
export function setPrograms(programs){
  store.programs = programs
  console.log("setPrograms", store.programs)
}
export function getDataObject(key){
  console.log("checkprograms", store.categories)
  if(!isEmpty(store.categories)){
    const category = store.categories[key]
    if(isEmpty(category)){
      const program = store.programs[key]
      if(!isEmpty(program)){
        return program
      }
    }else{
      return category
    }
  }
  return undefined
}
