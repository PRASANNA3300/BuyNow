import React, { useState } from 'react';
import { useCreateUser, useUpdateUser } from '../../hooks/useUsers';
import { UserProfile, CreateUserData } from '../../types/user';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface UserFormProps {
  user?: UserProfile | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    password: '',
    role: user?.role || 'user' as const,
    phone: user?.phone || '',
    department: user?.department || '',
    isActive: user?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEditing = !!user;
  const mutation = isEditing ? updateUserMutation : createUserMutation;

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'User' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!isEditing && !formData.password) {
      newErrors.password = 'Password is required for new users';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data: CreateUserData = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        password: formData.password,
        role: formData.role,
        phone: formData.phone.trim() || undefined,
        department: formData.department.trim() || undefined,
        isActive: formData.isActive,
      };

      if (isEditing) {
        const updateData = { ...data, id: user.id };
        if (!formData.password) {
          delete updateData.password;
        }
        await updateUserMutation.mutateAsync(updateData);
      } else {
        await createUserMutation.mutateAsync(data);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          placeholder="user@example.com"
          required
        />

        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={isEditing ? "New Password (leave blank to keep current)" : "Password"}
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          placeholder="••••••••"
          required={!isEditing}
        />

        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          options={roleOptions}
          error={errors.role}
          placeholder="Select a role"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
          helperText="Optional"
        />

        <Input
          label="Department"
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          placeholder="Engineering"
          helperText="Optional"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
        />
        <label htmlFor="isActive" className="text-sm text-slate-700">
          User account is active
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={mutation.isPending}
        >
          {isEditing ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}