interface WalletBalance {
    currency: string;
    amount: number;
  }
/*
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
  }
*/ //1. Remove FormattedWalletBalance interface
  
class Datasource {
    private url: string;
  
    // Constructor to initialize the data source with a URL
    constructor(url: string) {
      this.url = url;
    }
  
    // Method to fetch prices from the provided URL and transform them into a key-value map
    async getPrices(): Promise<Record<string, number>> {
      try {
        // Fetching the prices from the API
        const response = await fetch(this.url);
        
        // If the response is not ok, throw an error
        if (!response.ok) {
          throw new Error(`Error fetching prices: ${response.statusText}`);
        }
  
        // Parse the JSON response
        const data = await response.json();
  
        // Transform the array into a key-value map where the currency is the key
        const pricesMap: Record<string, number> = {};
        data.forEach((item: { currency: string, date: string, price: number }) => {
          pricesMap[item.currency] = item.price;
        });
  
        // Return the transformed prices map
        return pricesMap;
      } catch (error) {
        // Log the error and rethrow it for further handling
        console.error("Failed to fetch prices:", error);
        throw error;
      }
    }
  }
  
  interface Props extends BoxProps {
  
  }
  const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
      const [prices, setPrices] = useState({});
  
    useEffect(() => {
      const datasource = new Datasource("https://interview.switcheo.com/prices.json");
      datasource.getPrices().then(prices => {
        setPrices(prices);
      }).catch(error => {
        console.err(error);
      });
    }, []);
  
      const getPriority = (blockchain: string): number => { //3. replace any type with string type
        switch (blockchain) {
          case 'Osmosis':
            return 100
          case 'Ethereum':
            return 50
          case 'Arbitrum':
            return 30
          case 'Zilliqa':
            return 20
          case 'Neo':
            return 20
          default:
            return -99
        }
      }
  
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            return (balancePriority > -99 && balance.amount <= 0); //2. simplify the nested if statement
          }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
              const leftPriority = getPriority(lhs.blockchain);
              const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
              return -1;
            } else if (rightPriority > leftPriority) {
              return 1;
            }
      });
    }, [balances, prices]);

    /*
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      }
    })
    */ // 1.Remove formattedBalances 
  
    const rows = sortedBalances.map((balance: WalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      const formattedAmount = balance.amount.toFixed(); //1. dynamically calculate formatted amount instead

      return (
        <WalletRow 
          className={classes.row}
          key={balance.blockchain} //4. replace key value from index to a unique id (balance.blockchain)
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedAmount}
        />
      )
    })
  
    return (
      <div {...rest}>
        {rows}
      </div>
    )
  }