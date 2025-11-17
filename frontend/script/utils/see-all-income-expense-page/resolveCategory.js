function resolveCategory(category, data) {
 return category.value === 'see-all' ? data.category : category.value
  
}

export default resolveCategory