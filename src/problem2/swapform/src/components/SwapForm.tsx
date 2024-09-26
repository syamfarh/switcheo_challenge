import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, Button, InputAdornment } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const SwapForm: React.FC = () => {

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
                    //value={sellAmount}
                    //onChange={(e) => setSellAmount(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                <TextField
                                    select
                                    //value={sellToken.symbol}
                                    //onChange={(e) =>
                                        //setSellToken(tokenList.find((token) => token.symbol === e.target.value)!)
                                    //}
                                    variant="standard"
                                    sx={{ minWidth: 80 }}
                                >
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
          //value={buyAmount}
          //onChange={(e) => setBuyAmount(e.target.value)}
          slotProps={{
            input: {
            startAdornment: (
              <InputAdornment position="start">
                <TextField
                  select
                  //value={buyToken?.symbol || ''}
                  //onChange={(e) =>
                    //setBuyToken(tokenList.find((token) => token.symbol === e.target.value)!)
                  
                  variant="standard"
                  sx={{ minWidth: 80 }}
                >

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
  