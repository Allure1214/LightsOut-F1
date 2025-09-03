'use client'

interface FlagDisplayProps {
  nationality: string
  size?: 'sm' | 'md' | 'lg'
}

export function FlagDisplay({ nationality, size = 'md' }: FlagDisplayProps) {
  const getFlagColors = (nationality: string): string => {
    const flagStyles: { [key: string]: string } = {
      // British Union Jack - Blue background with red and white elements
      'British': 'bg-blue-800',
      // Dutch - Red, white, blue horizontal stripes
      'Dutch': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      // Spanish - Red, yellow, red horizontal stripes
      'Spanish': 'bg-gradient-to-b from-red-600 via-yellow-400 to-red-600',
      // Monaco - Red and white horizontal stripes
      'Monégasque': 'bg-gradient-to-b from-red-600 to-white',
      'Monegasque': 'bg-gradient-to-b from-red-600 to-white',
      // Mexican - Green, white, red vertical stripes
      'Mexican': 'bg-gradient-to-r from-green-600 via-white to-red-600',
      // Australian - Blue background (simplified)
      'Australian': 'bg-blue-800',
      // Canadian - Red and white (simplified as red)
      'Canadian': 'bg-red-600',
      // French - Blue, white, red vertical stripes
      'French': 'bg-gradient-to-r from-blue-600 via-white to-red-600',
      // German - Black, red, yellow horizontal stripes
      'German': 'bg-gradient-to-b from-black via-red-600 to-yellow-400',
      // Japanese - White background with red circle (simplified as red)
      'Japanese': 'bg-red-600',
      // Finnish - White and blue cross (simplified as blue)
      'Finnish': 'bg-blue-600',
      // Danish - Red background with white cross (simplified as red)
      'Danish': 'bg-red-600',
      // Thai - Red, white, blue, white, red horizontal stripes
      'Thai': 'bg-gradient-to-b from-red-600 via-white via-blue-600 via-white to-red-600',
      // Chinese - Red background
      'Chinese': 'bg-red-600',
      // American - Red, white, blue (simplified as blue)
      'American': 'bg-blue-600',
      // Italian - Green, white, red vertical stripes
      'Italian': 'bg-gradient-to-r from-green-600 via-white to-red-600',
      // Brazilian - Green, yellow, blue (simplified as green)
      'Brazilian': 'bg-green-600',
      // Argentine - Light blue and white horizontal stripes
      'Argentine': 'bg-gradient-to-b from-blue-400 via-white to-blue-400',
      // South African - Multiple colors (simplified as green)
      'South African': 'bg-green-600',
      // Austrian - Red, white, red horizontal stripes
      'Austrian': 'bg-gradient-to-b from-red-600 via-white to-red-600',
      // Swiss - Red background with white cross (simplified as red)
      'Swiss': 'bg-red-600',
      // Belgian - Black, yellow, red vertical stripes
      'Belgian': 'bg-gradient-to-r from-black via-yellow-400 to-red-600',
      // New Zealand - Blue background (simplified)
      'New Zealander': 'bg-blue-800',
      // Venezuelan - Yellow, blue, red horizontal stripes
      'Venezuelan': 'bg-gradient-to-b from-yellow-400 via-blue-600 to-red-600',
      // Russian - White, blue, red horizontal stripes
      'Russian': 'bg-gradient-to-b from-white via-blue-600 to-red-600',
      // Portuguese - Green and red vertical stripes
      'Portuguese': 'bg-gradient-to-r from-green-600 to-red-600',
      // Polish - White and red horizontal stripes
      'Polish': 'bg-gradient-to-b from-white to-red-600',
      // Czech - White, red, blue (simplified as blue)
      'Czech': 'bg-blue-600',
      // Hungarian - Red, white, green horizontal stripes
      'Hungarian': 'bg-gradient-to-b from-red-600 via-white to-green-600',
      // Swedish - Blue background with yellow cross (simplified as blue)
      'Swedish': 'bg-blue-600',
      // Norwegian - Red background with blue cross (simplified as red)
      'Norwegian': 'bg-red-600',
      // Indian - Orange, white, green horizontal stripes
      'Indian': 'bg-gradient-to-b from-orange-500 via-white to-green-600',
      // Colombian - Yellow, blue, red horizontal stripes
      'Colombian': 'bg-gradient-to-b from-yellow-400 via-blue-600 to-red-600',
      // Chilean - Blue, white, red horizontal stripes
      'Chilean': 'bg-gradient-to-b from-blue-600 via-white to-red-600',
      // Uruguayan - Blue and white horizontal stripes
      'Uruguayan': 'bg-gradient-to-b from-blue-600 via-white to-blue-600',
      // Peruvian - Red, white, red vertical stripes
      'Peruvian': 'bg-gradient-to-r from-red-600 via-white to-red-600',
      // Ecuadorian - Yellow, blue, red horizontal stripes
      'Ecuadorian': 'bg-gradient-to-b from-yellow-400 via-blue-600 to-red-600',
      // Paraguayan - Red, white, blue horizontal stripes
      'Paraguayan': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      // Bolivian - Red, yellow, green horizontal stripes
      'Bolivian': 'bg-gradient-to-b from-red-600 via-yellow-400 to-green-600',
      // Croatian - Red, white, blue horizontal stripes
      'Croatian': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      // Slovenian - White, blue, red horizontal stripes
      'Slovenian': 'bg-gradient-to-b from-white via-blue-600 to-red-600',
      // Slovak - White, blue, red horizontal stripes
      'Slovak': 'bg-gradient-to-b from-white via-blue-600 to-red-600',
      // Romanian - Blue, yellow, red vertical stripes
      'Romanian': 'bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600',
      // Bulgarian - White, green, red horizontal stripes
      'Bulgarian': 'bg-gradient-to-b from-white via-green-600 to-red-600',
      // Greek - Blue and white (simplified as blue)
      'Greek': 'bg-blue-600',
      // Turkish - Red background
      'Turkish': 'bg-red-600',
      // Israeli - Blue and white (simplified as blue)
      'Israeli': 'bg-blue-600',
      // Lebanese - Red, white, green horizontal stripes
      'Lebanese': 'bg-gradient-to-b from-red-600 via-white to-green-600',
      // Jordanian - Black, white, green horizontal stripes
      'Jordanian': 'bg-gradient-to-b from-black via-white to-green-600',
      // Emirati - Red, green, white, black vertical stripes
      'Emirati': 'bg-gradient-to-r from-red-600 via-green-600 via-white to-black',
      // Saudi - Green background
      'Saudi': 'bg-green-600',
      // Qatari - Red and white (simplified as red)
      'Qatari': 'bg-red-600',
      // Kuwaiti - Green, white, red, black horizontal stripes
      'Kuwaiti': 'bg-gradient-to-b from-green-600 via-white via-red-600 to-black',
      // Bahraini - Red and white (simplified as red)
      'Bahraini': 'bg-red-600',
      // Omani - Red, white, green horizontal stripes
      'Omani': 'bg-gradient-to-b from-red-600 via-white to-green-600',
      // Yemeni - Red, white, black horizontal stripes
      'Yemeni': 'bg-gradient-to-b from-red-600 via-white to-black',
      // Iraqi - Red, white, black horizontal stripes
      'Iraqi': 'bg-gradient-to-b from-red-600 via-white to-black',
      // Iranian - Green, white, red horizontal stripes
      'Iranian': 'bg-gradient-to-b from-green-600 via-white to-red-600',
      // Afghan - Black, red, green horizontal stripes
      'Afghan': 'bg-gradient-to-b from-black via-red-600 to-green-600',
      // Pakistani - Green and white (simplified as green)
      'Pakistani': 'bg-green-600',
      // Bangladeshi - Green and red (simplified as green)
      'Bangladeshi': 'bg-green-600',
      // Sri Lankan - Multiple colors (simplified as orange)
      'Sri Lankan': 'bg-orange-500',
      // Nepalese - Red background
      'Nepalese': 'bg-red-600',
      // Bhutanese - Yellow and orange (simplified as yellow)
      'Bhutanese': 'bg-yellow-400',
      // Maldivian - Red and green (simplified as red)
      'Maldivian': 'bg-red-600',
      // Indonesian - Red and white horizontal stripes
      'Indonesian': 'bg-gradient-to-b from-red-600 to-white',
      // Malaysian - Red, white, blue horizontal stripes
      'Malaysian': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      // Singaporean - Red and white horizontal stripes
      'Singaporean': 'bg-gradient-to-b from-red-600 to-white',
      // Filipino - Blue, red, blue horizontal stripes
      'Filipino': 'bg-gradient-to-b from-blue-600 via-red-600 to-blue-600',
      // Vietnamese - Red and yellow (simplified as red)
      'Vietnamese': 'bg-red-600',
      // Cambodian - Blue, red, blue horizontal stripes
      'Cambodian': 'bg-gradient-to-b from-blue-600 via-red-600 to-blue-600',
      // Laotian - Red, white, blue horizontal stripes
      'Laotian': 'bg-gradient-to-b from-red-600 via-white to-blue-600',
      // Myanmar - Yellow, green, red horizontal stripes
      'Myanmar': 'bg-gradient-to-b from-yellow-400 via-green-600 to-red-600',
      // Korean - White, blue, red (simplified as blue)
      'Korean': 'bg-blue-600',
      // North Korean - Blue, white, red (simplified as blue)
      'North Korean': 'bg-blue-600',
      // Mongolian - Red, blue, red horizontal stripes
      'Mongolian': 'bg-gradient-to-b from-red-600 via-blue-600 to-red-600',
      // Taiwanese - Red, white, blue (simplified as red)
      'Taiwanese': 'bg-red-600',
      // Hong Kong - Red background
      'Hong Kong': 'bg-red-600',
      // Macanese - Green background
      'Macanese': 'bg-green-600'
    }
    
    return flagStyles[nationality] || 'bg-gray-400'
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
      className={`${sizeClasses} ${flagColors} rounded border shadow-sm`}
      title={`${normalizedNationality} flag`}
    >
    </div>
  )
}
