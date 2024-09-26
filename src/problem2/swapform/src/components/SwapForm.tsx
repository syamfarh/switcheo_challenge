import React, { useEffect, useState, useRef } from 'react';
import { TextField, MenuItem, Button, InputAdornment } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';

interface PriceData {
    currency: string;
    price: number;
  }
const SwapForm: React.FC = () => {
    const [sellToken, setSellToken] = useState<string>(''); // Selected sell token
    const [buyToken, setBuyToken] = useState<string>('');   // Selected buy token
    const [sellAmount, setSellAmount] = useState<string>(''); // Amount to sell
    const [buyAmount, setBuyAmount] = useState<string>('');   // Amount to buy
    const [tokenPrices, setTokenPrices] = useState<PriceData[]>([]); // Tokens and their prices
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    const timeoutRef = useRef<number | undefined>();

    useEffect(() => {
        const fetchPrices = async () => {
          try {
            const response = await fetch('https://interview.switcheo.com/prices.json');
            const data: PriceData[] = await response.json();
            setTokenPrices(data);
            setSellToken(data[0]?.currency); // Set default sell token to the first one
            setBuyToken(data[0]?.currency);  // Set default buy token to the first one
            setLoading(false);               // Set loading to false after fetching
          } catch (error) {
            console.error('Error fetching token prices:', error);
            setLoading(false);
          }
        };
    
        fetchPrices();
      }, []);

    const getTokenPrice = (symbol: string): number | undefined => {
        const tokenData = tokenPrices.find((priceData) => priceData.currency === symbol);
        return tokenData ? tokenData.price : undefined;
    };

      // Validate input to allow only positive numbers
    const validateInput = (value: string) => {
        const regex = /^[0-9]*\.?[0-9]*$/; // Regex to allow numbers and decimal point
        return regex.test(value);
    };

  // Unified handler for updating both Sell and Buy amounts
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'sell' | 'buy') => {
    const value = e.target.value;
    if (validateInput(value)) {
      if (field === 'sell') {
        setSellAmount(value);
        debounceUpdateAmounts(value, 'sell');
      } else if (field === 'buy') {
        setBuyAmount(value);
        debounceUpdateAmounts(value, 'buy');
      }
    }
  };

  // Debounce function to update amounts with a delay
  const debounceUpdateAmounts = (value: string, field: 'sell' | 'buy') => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to delay the calculation
    timeoutRef.current = window.setTimeout(() => {
      const sellPrice = getTokenPrice(sellToken);
      const buyPrice = getTokenPrice(buyToken);

      if (sellPrice && buyPrice) {
        if (field === 'sell') {
            if (value) {
                // Update Buy amount based on Sell amount
                const newBuyAmount = (parseFloat(value) * sellPrice) / buyPrice;
                setBuyAmount(newBuyAmount.toFixed(6));
            } else {
                setBuyAmount('');
            }
        } else if (field === 'buy') {
            if (value) {
                // Update Sell amount based on Buy amount
                const newSellAmount = (parseFloat(value) * buyPrice) / sellPrice;
                setSellAmount(newSellAmount.toFixed(6));
            } else {
                setSellAmount('');
            }

        }
      }
    }, 500); // 500ms debounce delay
  };

    // Swap tokens and amounts
    const handleSwapTokens = () => {
        // Swap tokens
        const tempToken = sellToken;
        setSellToken(buyToken);
        setBuyToken(tempToken);
    
        // Swap amounts
        const tempAmount = sellAmount;
        setSellAmount(buyAmount);
        setBuyAmount(tempAmount);
      };

    if (loading) {
        return <div className="text-center text-white">Loading tokens...</div>;
    }

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md max-w-md mx-auto text-white">
            <h1 className="text-2xl mb-4 text-center">Swap</h1>
            <div className="mb-4">
            {/* Sell Amount */}
                <TextField
                    label="Sell"
                    variant="outlined"
                    type="text"
                    fullWidth
                    value={sellAmount}
                    placeholder="0"
                    onChange={(e) => handleAmountChange(e, 'sell')}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                <TextField
                                    select
                                    value={sellToken}
                                    onChange={(e) => setSellToken(e.target.value)}
                                    variant="standard"
                                    sx={{ minWidth: 80 }}
                                >
                                    {tokenPrices.map((token) => (
                                        <MenuItem key={token.currency} value={token.currency}>
                                            {token.currency}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </InputAdornment>
                            ),
                        },
                    }}
                    className="bg-gray-800 text-white rounded-lg"
                />
            </div>
            {/* Swap Icon */}
                <div className="flex justify-center mb-4">
                    {/* **Added onClick handler to swap tokens and amounts** */}
                    <SwapVertIcon fontSize="large" onClick={handleSwapTokens} style={{ cursor: 'pointer' }} />
                </div>
        
        {/* Buy Amount */}
      <div className="mb-4">
        <TextField
          label="Buy"
          variant="outlined"
          type="text"
          fullWidth
          value={buyAmount}
          placeholder="0"
          onChange={(e) => handleAmountChange(e, 'buy')}
          slotProps={{
            input: {
            startAdornment: (
              <InputAdornment position="start">
                <TextField
                  select
                  value={buyToken}
                  onChange={(e) => setBuyToken(e.target.value)}
                  variant="standard"
                  sx={{ minWidth: 80 }}
                >
                    {tokenPrices.map((token) => (
                    <MenuItem key={token.currency} value={token.currency}>
                      {token.currency}
                    </MenuItem>
                  ))}
                </TextField>
              </InputAdornment>
            ),
        },
          }}
          className="bg-gray-800 text-white rounded-lg"
        />
      </div>    
        </div>
        
    );
};

export default SwapForm;
  