import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchAccounts, transferFunds } from "@/services/api";
import { CreditCard } from 'lucide-react';
import NotificationDialog from '@/components/ui/NotificationDialog';

const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: "Insufficient funds available for transfer",
  SERVER_ERROR: "A server error occurred. Please try again later",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again"
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedFromAccount, setSelectedFromAccount] = useState(null);
  const [selectedToAccount, setSelectedToAccount] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState(null);
  
  const [notification, setNotification] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const fetchedAccounts = await fetchAccounts();
        setAccounts(fetchedAccounts);
      } catch (error) {
        const errorMessage = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.UNKNOWN_ERROR;
        showNotification(errorMessage, 'error');
      }
    };

    loadAccounts();
  }, []);

  const showNotification = (message, type) => {
    setNotification({
      isOpen: true,
      message,
      type
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const validateTransfer = () => {
    if (!selectedFromAccount || !selectedToAccount) {
      throw new Error("Please select both accounts for transfer");
    }

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Please enter a valid amount greater than 0");
    }

    if (amount > selectedFromAccount.balance) {
      throw new Error("Insufficient balance for transfer");
    }

    return amount;
  };

  const handleTransfer = async () => {
    setError(null);
    
    try {
      const validatedAmount = validateTransfer();
      setIsTransferring(true);

      await transferFunds(
        selectedFromAccount.payment_method_id,
        selectedToAccount.payment_method_id,
        validatedAmount
      );

      const updatedAccounts = await fetchAccounts();
      setAccounts(updatedAccounts);

      setIsTransferModalOpen(false);
      resetTransferForm();
      
      showNotification(
        `Successfully transferred $${validatedAmount.toFixed(2)} to ${selectedToAccount.method_name}`,
        'success'
      );
    } catch (error) {
      setError(error);
      
      if (error.code) {
        const errorMessage = ERROR_MESSAGES[error.code] || error.message;
        showNotification(errorMessage, 'error');
      } else {
        showNotification(error.message, 'error');
      }
    } finally {
      setIsTransferring(false);
    }
  };

  const resetTransferForm = () => {
    setSelectedToAccount(null);
    setTransferAmount('');
    setError(null);
  };

  return (
    <div className="p-4 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.payment_method_id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gray-100">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {account.method_name}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  ${parseFloat(account.balance).toFixed(2)}
                </h3>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => {
                    setIsTransferModalOpen(true);
                    setSelectedFromAccount(account);
                  }}
                >
                  Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog 
        open={isTransferModalOpen} 
        onOpenChange={(open) => {
          setIsTransferModalOpen(open);
          if (!open) resetTransferForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Funds</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error.message}
              </div>
            )}
            
            <div>
              <label className="block mb-2 text-sm font-medium">From Account</label>
              <Input 
                value={selectedFromAccount?.method_name || ''} 
                disabled 
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">To Account</label>
              <Select 
                onValueChange={(value) => {
                  const account = accounts.find(
                    a => a.payment_method_id === parseInt(value)
                  );
                  setSelectedToAccount(account);
                }}
                value={selectedToAccount?.payment_method_id?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter(a => a.payment_method_id !== selectedFromAccount?.payment_method_id)
                    .map((account) => (
                      <SelectItem 
                        key={account.payment_method_id} 
                        value={account.payment_method_id.toString()}
                      >
                        {account.method_name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Amount</label>
              <Input 
                type="number" 
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleTransfer}
              disabled={!selectedToAccount || !transferAmount || isTransferring}
              className="w-full"
            >
              {isTransferring ? "Transferring..." : "Confirm Transfer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={closeNotification}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default Accounts;