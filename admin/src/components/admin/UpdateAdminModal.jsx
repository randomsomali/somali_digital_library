import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateAdminProfile } from '@/services/api';
import { z } from 'zod';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NotificationDialog from '@/components/ui/NotificationDialog';
import { Loader2, Info } from 'lucide-react';

// Zod schema for form validation
const updateProfileSchema = z.object({
  fullname: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Full name must contain only letters and spaces'),
  
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email is too short')
    .max(50, 'Email must not exceed 50 characters'),
  
  currentPassword: z.string().optional(),
  
  newPassword: z.string().optional()
    .refine(val => !val || val.length >= 8, 'Password must be at least 8 characters')
    .refine(val => !val || /[A-Z]/.test(val), 'Password must contain at least one uppercase letter')
    .refine(val => !val || /[a-z]/.test(val), 'Password must contain at least one lowercase letter')
    .refine(val => !val || /[0-9]/.test(val), 'Password must contain at least one number')
    .refine(val => !val || /[^A-Za-z0-9]/.test(val), 'Password must contain at least one special character'),
  
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.newPassword) {
    return data.currentPassword?.length > 0;
  }
  return true;
}, {
  message: "Current password is required to set new password",
  path: ["currentPassword"],
}).refine(data => {
  if (data.newPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const UpdateAdminModal = ({ admin, isOpen, onClose }) => {
  const { updateAdminInContext } = useAuth();
  const [formData, setFormData] = useState({
    fullname: admin?.fullname || '',
    email: admin?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullname: admin?.fullname || '',
        email: admin?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
    }
  }, [isOpen, admin]);

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      onClose();
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = updateProfileSchema.parse(formData);

      // Create payload excluding empty password fields
      const payload = {
        fullname: validatedData.fullname,
        email: validatedData.email
      };

      // Only include password fields if new password is being set
      if (validatedData.newPassword) {
        payload.currentPassword = validatedData.currentPassword;
        payload.newPassword = validatedData.newPassword;
      }

      const { admin: updatedAdmin, message } = await updateAdminProfile(payload);
      updateAdminInContext(updatedAdmin);
      
      setNotification({
        isOpen: true,
        type: 'success',
        message: message || 'Profile updated successfully!'
      });

      // Close modal after short delay on success only
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const fieldErrors = {};
        error.errors.forEach(err => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        // Handle API errors
        const errorMessage = error.message || 'Failed to update profile';
        
        if (error.response?.data?.errors) {
          const fieldErrors = {};
          error.response.data.errors.forEach(err => {
            fieldErrors[err.param] = err.msg;
          });
          setErrors(fieldErrors);
        } else if (errorMessage.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, email: errorMessage }));
        } else if (errorMessage.toLowerCase().includes('current password')) {
          setErrors(prev => ({ ...prev, currentPassword: "Incorrect current password" }));
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors(prev => ({ ...prev, newPassword: errorMessage }));
        } else {
          setNotification({
            isOpen: true,
            type: 'error',
            message: errorMessage
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={handleClose}>
        <AlertDialogContent className="bg-background max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Update Admin Profile</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Make changes to your admin account settings
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className={errors.fullname ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.fullname && (
                  <p className="text-sm text-destructive">{errors.fullname}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label>Change Password (Optional)</Label>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="currentPassword" className="text-sm">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={errors.currentPassword ? "border-destructive" : ""}
                    disabled={isSubmitting}
                    placeholder="Required to change password"
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-destructive">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="newPassword" className="text-sm">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={errors.newPassword ? "border-destructive" : ""}
                    disabled={isSubmitting}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword}</p>
                  )}
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one special character</li>
                  </ul>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-sm">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                    disabled={isSubmitting}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel 
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </AlertDialogCancel>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
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

export default UpdateAdminModal; 