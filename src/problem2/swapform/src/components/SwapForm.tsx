import React, { useEffect, useState } from 'react';
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

    // Calculate buy amount based on sell amount and token prices
    useEffect(() => {
        if (sellAmount && sellToken && buyToken) {
          const sellPrice = getTokenPrice(sellToken);
          const buyPrice = getTokenPrice(buyToken);
    
          if (sellPrice && buyPrice) {
            const buyAmountValue = (parseFloat(sellAmount) * sellPrice) / buyPrice;
            setBuyAmount(buyAmountValue.toFixed(6));
          }
        }
      }, [sellAmount, sellToken, buyToken, tokenPrices]);

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md max-w-md mx-auto text-white">
            <h1 className="text-2xl mb-4 text-center">Swap</h1>
            <div className="mb-4">
            {/* Sell Amount */}
                <TextField
                    label="Sell"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
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
                                            {token.currency} - ${token.price.toFixed(2)}
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
                
            </div> 
                  {/* Buy Amount */}
      <div className="mb-4">
        <TextField
          label="Buy"
          variant="outlined"
          type="number"
          fullWidth
          value={buyAmount}
          onChange={(e) => setBuyAmount(e.target.value)}
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
                      {token.currency} - ${token.price.toFixed(2)}
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
  