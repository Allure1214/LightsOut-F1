'use client'

interface FlagDisplayProps {
  nationality: string
  size?: 'sm' | 'md' | 'lg'
}

export function FlagDisplay({ nationality, size = 'md' }: FlagDisplayProps) {
  const getFlagColors = (nationality: string): string => {
    const flagStyles: { [key: string]: string } = {
      'British': 'bg-gradient-to-r from-red-600 via-white to-blue-600',
      'Dutch': 'bg-gradient-to-r from-red-600 via-white to-blue-600',
      'Spanish': 'bg-gradient-to-b from-red-600 via-yellow-400 to-red-600',
      'Monégasque': 'bg-gradient-to-r from-red-600 to-white',
      'Monegasque': 'bg-gradient-to-r from-red-600 to-white',
      'Mexican': 'bg-gradient-to-r from-green-600 via-white to-red-600',
      'Australian': 'bg-gradient-to-r from-blue-600 via-white to-blue-600',
      'Canadian': 'bg-gradient-to-r from-red-600 via-white to-red-600',
      'French': 'bg-gradient-to-r from-blue-600 via-white to-red-600',
      'German': 'bg-gradient-to-b from-black via-red-600 to-yellow-400',
      'Japanese': 'bg-white border-2 border-red-600',
      'Finnish': 'bg-gradient-to-r from-white to-blue-600',
      'Danish': 'bg-gradient-to-r from-red-600 via-white to-red-600',
      'Thai': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      'Chinese': 'bg-gradient-to-r from-red-600 via-yellow-400 to-red-600',
      'American': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      'Italian': 'bg-gradient-to-r from-green-600 via-white to-red-600',
      'Brazilian': 'bg-gradient-to-b from-green-600 via-yellow-400 to-blue-600',
      'Argentine': 'bg-gradient-to-b from-lightblue-400 via-white to-lightblue-400',
      'South African': 'bg-gradient-to-r from-red-600 via-white to-blue-600',
      'Austrian': 'bg-gradient-to-r from-red-600 via-white to-red-600',
      'Swiss': 'bg-gradient-to-r from-red-600 to-white',
      'Belgian': 'bg-gradient-to-r from-black via-yellow-400 to-red-600',
      'New Zealander': 'bg-gradient-to-r from-blue-600 via-white to-blue-600',
      'Venezuelan': 'bg-gradient-to-b from-yellow-400 via-blue-600 to-red-600',
      'Russian': 'bg-gradient-to-b from-white via-blue-600 to-red-600',
      'Portuguese': 'bg-gradient-to-r from-green-600 via-red-600 to-green-600',
      'Polish': 'bg-gradient-to-b from-white to-red-600',
      'Czech': 'bg-gradient-to-r from-white via-red-600 to-blue-600',
      'Hungarian': 'bg-gradient-to-b from-red-600 via-white to-green-600',
      'Swedish': 'bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600',
      'Norwegian': 'bg-gradient-to-r from-red-600 via-white to-blue-600',
      'Indian': 'bg-gradient-to-b from-orange-500 via-white to-green-600',
      'Colombian': 'bg-gradient-to-b from-yellow-400 via-blue-600 to-red-600',
      'Chilean': 'bg-gradient-to-b from-blue-600 via-white to-red-600',
      'Uruguayan': 'bg-gradient-to-b from-blue-600 via-white to-blue-600',
      'Peruvian': 'bg-gradient-to-r from-red-600 via-white to-red-600',
      'Ecuadorian': 'bg-gradient-to-b from-yellow-400 via-blue-600 to-red-600',
      'Paraguayan': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      'Bolivian': 'bg-gradient-to-b from-red-600 via-yellow-400 to-green-600',
      'Croatian': 'bg-gradient-to-r from-red-600 via-white to-blue-600',
      'Slovenian': 'bg-gradient-to-b from-white via-blue-600 to-red-600',
      'Slovak': 'bg-gradient-to-b from-white via-blue-600 to-red-600',
      'Romanian': 'bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600',
      'Bulgarian': 'bg-gradient-to-b from-white via-green-600 to-red-600',
      'Greek': 'bg-gradient-to-b from-blue-600 via-white to-blue-600',
      'Turkish': 'bg-gradient-to-r from-red-600 to-white',
      'Israeli': 'bg-gradient-to-b from-blue-600 via-white to-blue-600',
      'Lebanese': 'bg-gradient-to-b from-red-600 via-white to-green-600',
      'Jordanian': 'bg-gradient-to-b from-black via-white to-green-600',
      'Emirati': 'bg-gradient-to-r from-red-600 via-white to-black',
      'Saudi': 'bg-gradient-to-r from-green-600 to-white',
      'Qatari': 'bg-gradient-to-r from-red-600 to-white',
      'Kuwaiti': 'bg-gradient-to-r from-green-600 via-white to-red-600',
      'Bahraini': 'bg-gradient-to-r from-red-600 to-white',
      'Omani': 'bg-gradient-to-r from-red-600 via-white to-green-600',
      'Yemeni': 'bg-gradient-to-b from-red-600 via-white to-black',
      'Iraqi': 'bg-gradient-to-b from-red-600 via-white to-black',
      'Iranian': 'bg-gradient-to-b from-green-600 via-white to-red-600',
      'Afghan': 'bg-gradient-to-r from-black via-red-600 to-green-600',
      'Pakistani': 'bg-gradient-to-r from-green-600 to-white',
      'Bangladeshi': 'bg-gradient-to-r from-green-600 to-red-600',
      'Sri Lankan': 'bg-gradient-to-r from-orange-500 via-yellow-400 to-green-600',
      'Nepalese': 'bg-gradient-to-b from-red-600 via-blue-600 to-red-600',
      'Bhutanese': 'bg-gradient-to-b from-yellow-400 to-orange-500',
      'Maldivian': 'bg-gradient-to-r from-red-600 to-green-600',
      'Indonesian': 'bg-gradient-to-b from-red-600 to-white',
      'Malaysian': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      'Singaporean': 'bg-gradient-to-b from-red-600 to-white',
      'Filipino': 'bg-gradient-to-b from-blue-600 via-red-600 to-blue-600',
      'Vietnamese': 'bg-gradient-to-b from-red-600 to-yellow-400',
      'Cambodian': 'bg-gradient-to-b from-blue-600 via-red-600 to-blue-600',
      'Laotian': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      'Myanmar': 'bg-gradient-to-b from-yellow-400 via-green-600 to-red-600',
      'Korean': 'bg-gradient-to-b from-blue-600 via-white to-red-600',
      'North Korean': 'bg-gradient-to-b from-blue-600 via-white to-red-600',
      'Mongolian': 'bg-gradient-to-r from-red-600 via-blue-600 to-red-600',
      'Taiwanese': 'bg-gradient-to-r from-red-600 to-blue-600',
      'Hong Kong': 'bg-gradient-to-r from-red-600 to-white',
      'Macanese': 'bg-gradient-to-r from-green-600 to-white'
    }
    
    return flagStyles[nationality] || 'bg-gray-200'
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'w-6 h-4 text-xs'
      case 'lg': return 'w-12 h-8 text-sm'
      default: return 'w-8 h-6 text-xs'
    }
  }

  const getCountryCode = (nationality: string): string => {
    const countryCodes: { [key: string]: string } = {
      'British': 'GB',
      'Dutch': 'NL',
      'Spanish': 'ES',
      'Monégasque': 'MC',
      'Monegasque': 'MC',
      'Mexican': 'MX',
      'Australian': 'AU',
      'Canadian': 'CA',
      'French': 'FR',
      'German': 'DE',
      'Japanese': 'JP',
      'Finnish': 'FI',
      'Danish': 'DK',
      'Thai': 'TH',
      'Chinese': 'CN',
      'American': 'US',
      'Italian': 'IT',
      'Brazilian': 'BR',
      'Argentine': 'AR',
      'South African': 'ZA',
      'Austrian': 'AT',
      'Swiss': 'CH',
      'Belgian': 'BE',
      'New Zealander': 'NZ',
      'Venezuelan': 'VE',
      'Russian': 'RU',
      'Portuguese': 'PT',
      'Polish': 'PL',
      'Czech': 'CZ',
      'Hungarian': 'HU',
      'Swedish': 'SE',
      'Norwegian': 'NO',
      'Indian': 'IN',
      'Colombian': 'CO',
      'Chilean': 'CL',
      'Uruguayan': 'UY',
      'Peruvian': 'PE',
      'Ecuadorian': 'EC',
      'Paraguayan': 'PY',
      'Bolivian': 'BO',
      'Croatian': 'HR',
      'Slovenian': 'SI',
      'Slovak': 'SK',
      'Romanian': 'RO',
      'Bulgarian': 'BG',
      'Greek': 'GR',
      'Turkish': 'TR',
      'Israeli': 'IL',
      'Lebanese': 'LB',
      'Jordanian': 'JO',
      'Emirati': 'AE',
      'Saudi': 'SA',
      'Qatari': 'QA',
      'Kuwaiti': 'KW',
      'Bahraini': 'BH',
      'Omani': 'OM',
      'Yemeni': 'YE',
      'Iraqi': 'IQ',
      'Iranian': 'IR',
      'Afghan': 'AF',
      'Pakistani': 'PK',
      'Bangladeshi': 'BD',
      'Sri Lankan': 'LK',
      'Nepalese': 'NP',
      'Bhutanese': 'BT',
      'Maldivian': 'MV',
      'Indonesian': 'ID',
      'Malaysian': 'MY',
      'Singaporean': 'SG',
      'Filipino': 'PH',
      'Vietnamese': 'VN',
      'Cambodian': 'KH',
      'Laotian': 'LA',
      'Myanmar': 'MM',
      'Korean': 'KR',
      'North Korean': 'KP',
      'Mongolian': 'MN',
      'Taiwanese': 'TW',
      'Hong Kong': 'HK',
      'Macanese': 'MO'
    }
    
    const normalizedNationality = nationality?.trim() || ''
    return countryCodes[normalizedNationality] || 
           countryCodes[normalizedNationality.toLowerCase()] || 
           countryCodes[normalizedNationality.toUpperCase()] ||
           countryCodes[normalizedNationality.charAt(0).toUpperCase() + normalizedNationality.slice(1).toLowerCase()] ||
           'XX'
  }

  const normalizedNationality = nationality?.trim() || ''
  const flagColors = getFlagColors(normalizedNationality)
  const sizeClasses = getSizeClasses(size)
  const countryCode = getCountryCode(normalizedNationality)

  return (
    <div 
      className={`${sizeClasses} ${flagColors} rounded border flex items-center justify-center font-bold text-white shadow-sm`}
      title={`${normalizedNationality} flag`}
    >
      {countryCode}
    </div>
  )
}
