import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import NotificationDialog from './ui/NotificationDialog';
import { updateUserProfile } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.username?.trim()) {
    errors.username = "Username is required";
  } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
    errors.username = "Username must be alphanumeric";
  }
  
  if (!formData.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\+?[\d\s-]+$/.test(formData.phone)) {
    errors.phone = "Invalid phone number format";
  }
  
  if (!formData.full_name?.trim()) {
    errors.full_name = "Full name is required";
  }

  // Validate passwords only if new password is provided
  if (formData.new_password) {
    if (!formData.current_password) {
      errors.current_password = "Current password is required to set new password";
    }
    if (formData.new_password.length < 6) {
      errors.new_password = "New password must be at least 6 characters";
    }
  }

  return errors;
};

const UpdateUserModal = ({ user, onClose }) => {
  const { updateUserInContext } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    phone: user?.phone || '',
    current_password: '',
    new_password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Create payload excluding empty password fields
    const payload = {
      full_name: formData.full_name,
      username: formData.username,
      phone: formData.phone
    };

    // Only include password fields if new password is being set
    if (formData.new_password) {
      payload.current_password = formData.current_password;
      payload.new_password = formData.new_password;
    }

    try {
      const response = await updateUserProfile(payload);
      // Update the user context with the new data
      updateUserInContext(response.data || response);
      
      setNotification({
        isOpen: true,
        type: 'success',
        message: 'Profile updated successfully!'
      });

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      
      // Handle specific field errors
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach(err => {
          fieldErrors[err.param] = err.msg;
        });
        setErrors(fieldErrors);
      } else if (errorMessage.toLowerCase().includes('username')) {
        setErrors(prev => ({ ...prev, username: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('phone')) {
        setErrors(prev => ({ ...prev, phone: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('current password')) {
        setErrors(prev => ({ ...prev, current_password: "Incorrect current password" }));
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors(prev => ({ ...prev, new_password: errorMessage }));
      } else {
        setNotification({
          isOpen: true,
          type: 'error',
          message: errorMessage
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AlertDialog open={true} onOpenChange={onClose}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Update Profile</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Update your profile information
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={errors.full_name ? "border-red-500" : ""}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">{errors.full_name}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="grid gap-4">
                <Label>Change Password (Optional)</Label>
                <div className="grid gap-2">
                  <Label htmlFor="current_password" className="text-sm">Current Password</Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    className={errors.current_password ? "border-red-500" : ""}
                    placeholder="Enter current password to change"
                  />
                  {errors.current_password && (
                    <p className="text-sm text-red-500">{errors.current_password}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="new_password" className="text-sm">New Password</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    className={errors.new_password ? "border-red-500" : ""}
                    placeholder="Enter new password"
                  />
                  {errors.new_password && (
                    <p className="text-sm text-red-500">{errors.new_password}</p>
                  )}
                </div>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel 
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </AlertDialogCancel>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        message={notification.message}
        type={notification.type}
      />
    </>
  );
};

export default UpdateUserModal;