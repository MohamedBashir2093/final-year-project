const Marketplace = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { user } = useAuth()

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'sports', label: 'Sports' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'other', label: 'Other' }
  ]

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        title: 'Vintage Wooden Chair',
        description: 'Beautiful vintage wooden chair in excellent condition. Perfect for your living room or dining area.',
        price: 45,
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop',
        seller: {
          name: 'Sarah Johnson',
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff'
        },
        location: '2 blocks away',
        date: '2024-01-15',
        condition: 'Excellent'
      },
      {
        id: 2,
        title: 'Bicycle - Like New',
        description: 'Mountain bike, barely used. Includes helmet and lock. Great for neighborhood rides.',
        price: 120,
        category: 'sports',
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop',
        seller: {
          name: 'Mike Chen',
          avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=3B82F6&color=fff'
        },
        location: '5 blocks away',
        date: '2024-01-14',
        condition: 'Like New'
      },
      {
        id: 3,
        title: 'Bookshelf',
        description: 'Solid wood bookshelf, 5 shelves. Perfect condition. Must pick up.',
        price: 65,
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
        seller: {
          name: 'Emma Davis',
          avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=8B5CF6&color=fff'
        },
        location: '3 blocks away',
        date: '2024-01-13',
        condition: 'Good'
      },
      {
        id: 4,
        title: 'iPhone 12 Pro',
        description: '128GB, Pacific Blue. Includes original box and charger. Screen protector applied since day one.',
        price: 450,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop',
        seller: {
          name: 'Alex Rivera',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=EF4444&color=fff'
        },
        location: '4 blocks away',
        date: '2024-01-12',
        condition: 'Excellent'
      },
      {
        id: 5,
        title: 'Garden Tools Set',
        description: 'Complete gardening tool set. Includes shovel, rake, gloves, and pruning shears.',
        price: 35,
        category: 'home',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        seller: {
          name: 'David Wilson',
          avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=F59E0B&color=fff'
        },
        location: '6 blocks away',
        date: '2024-01-11',
        condition: 'Good'
      },
      {
        id: 6,
        title: 'Designer Handbag',
        description: 'Genuine leather handbag, barely used. Perfect condition with dust bag.',
        price: 85,
        category: 'clothing',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
        seller: {
          name: 'Sophia Martinez',
          avatar: 'https://ui-avatars.com/api/?name=Sophia+Martinez&background=EC4899&color=fff'
        },
        location: '1 block away',
        date: '2024-01-10',
        condition: 'Like New'
      }
    ]

    setTimeout(() => {
      setItems(mockItems)
      setFilteredItems(mockItems)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchTerm, selectedCategory])

  const filterItems = () => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredItems(filtered)
  }

  const ItemCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
          <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
            <Share className="w-4 h-4 text-gray-600 hover:text-blue-500" />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.condition === 'Like New' ? 'bg-green-100 text-green-800' :
            item.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {item.condition}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
          <span className="text-xl font-bold text-blue-600">${item.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
          <span>{new Date(item.date).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
          <img
            src={item.seller.avatar}
            alt={item.seller.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-700 font-medium">{item.seller.name}</span>
        </div>

        <div className="flex space-x-2 mt-4">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Contact Seller
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Save
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-2">Buy and sell items with people in your neighborhood</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold">
          <Plus className="w-5 h-5" />
          <span>List Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search filters' 
                : 'Be the first to list an item in your neighborhood!'
              }
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              List Your First Item
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Marketplace