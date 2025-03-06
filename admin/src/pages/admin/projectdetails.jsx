// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { getProjectById, getUploadsUrl, updateProject } from '@/services/api';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import NotificationDialog from '@/components/ui/NotificationDialog';

// function cleanDescription(description) {
//   return description
//     .replace(/<br\s*\/?>/gi, '\n')
//     .replace(/\\r\\n|\\r|\\n/g, '\n')
//     .replace(/[ \t]+$/gm, '')
//     .replace(/\n{2,}/g, '\n\n')
//     .trim();
// }
// const ProjectForm = ({ onSubmit, initialData, onCancel }) => {
//   const [formData, setFormData] = useState(initialData ? {
//     ...initialData,
//   } : {
//     name: '',
//     description: '',
//     price: '',
//     status: '',
//     category_id: '',
//     components: '',
//     stock_quantity: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [images, setImages] = useState({
//     image: null,
//     image2: null,
//     diagram: null,
//   });

//   const validateForm = (data) => {
//     const errors = {};
//     if (!data.name?.trim()) errors.name = 'Name is required';
//     if (!data.description?.trim()) errors.description = 'Description is required';
//     if (!data.price) errors.price = 'Price is required';
//     if (!data.status) errors.status = 'Status is required';
//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const validationErrors = validateForm(formData);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       // Create FormData object for file upload
//       const formDataToSubmit = new FormData();
      
//       // Append all text fields
//       Object.keys(formData).forEach(key => {
//         if (formData[key] !== null && formData[key] !== undefined) {
//           formDataToSubmit.append(key, formData[key]);
//         }
//       });
      
//       // Append files if they exist
//       Object.keys(images).forEach(key => {
//         if (images[key]) {
//           formDataToSubmit.append(key, images[key]);
//         }
//       });

//       await onSubmit(formDataToSubmit);
//       setErrors({});
//     } catch (error) {
//       setErrors({ submit: error.message || 'Failed to update project' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleFileChange = (event, field) => {
//     const file = event.target.files[0];
//     setImages(prev => ({
//       ...prev,
//       [field]: file
//     }));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid gap-4">
//         <div className="grid gap-2">
//           <Label htmlFor="name">Name</Label>
//           <Input
//             id="name"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             className={errors.name ? 'border-red-500' : ''}
//           />
//           {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
//         </div>

//         <div className="grid gap-2">
//           <Label htmlFor="description">Description</Label>
//           <Textarea
//             id="description"
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             className={errors.description ? 'border-red-500' : ''}
//           />
//           {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
//         </div>

//         <div className="grid gap-2">
//           <Label htmlFor="price">Price</Label>
//           <Input
//             id="price"
//             type="number"
//             value={formData.price}
//             onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//             className={errors.price ? 'border-red-500' : ''}
//           />
//           {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
//         </div>

//         <div className="grid gap-2">
//           <Label htmlFor="status">Status</Label>
//           <Select
//             value={formData.status}
//             onValueChange={(value) => setFormData({ ...formData, status: value })}
//           >
//             <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
//               <SelectValue placeholder="Select status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="available">Available</SelectItem>
//               <SelectItem value="unavailable">Unavailable</SelectItem>
//               <SelectItem value="maintenance">Maintenance</SelectItem>
//             </SelectContent>
//           </Select>
//           {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
//         </div>

//         <div className="grid gap-2">
//           <Label htmlFor="components">Components</Label>
//           <Input
//             id="components"
//             value={formData.components}
//             onChange={(e) => setFormData({ ...formData, components: e.target.value })}
//           />
//         </div>

//         <div className="grid gap-2">
//           <Label>Images</Label>
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <Label htmlFor="image">Main Image</Label>
//               <Input
//                 id="image"
//                 type="file"
//                 onChange={(e) => handleFileChange(e, 'image')}
//                 className="mt-1"
//               />
//             </div>
//             <div>
//               <Label htmlFor="image2">Second Image</Label>
//               <Input
//                 id="image2"
//                 type="file"
//                 onChange={(e) => handleFileChange(e, 'image2')}
//                 className="mt-1"
//               />
//             </div>
//             <div>
//               <Label htmlFor="diagram">Diagram</Label>
//               <Input
//                 id="diagram"
//                 type="file"
//                 onChange={(e) => handleFileChange(e, 'diagram')}
//                 className="mt-1"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <DialogFooter>
//         <Button variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Saving...' : 'Save Project'}
//         </Button>
//       </DialogFooter>
//     </form>
//   );
// };

// const ProjectDetails = () => {
//   const { id } = useParams();
//   const [project, setProject] = useState(null);
//   const [mainImage, setMainImage] = useState('');
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: '' });
//   const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: '' });

//   useEffect(() => {
//     const fetchProject = async () => {
//       const data = await getProjectById(id);
//       setProject(data);
//       setMainImage(data.image);
//     };
//     fetchProject();
//   }, [id]);

//   const handleImageSelect = (image) => {
//     setMainImage(image);
//   };

//   const handleUpdateProject = async (updatedProject) => {
//     try {
//       await updateProject(id, updatedProject);
//       const updatedData = await getProjectById(id);
//       setProject(updatedData);
//       setIsEditModalOpen(false);
//       setSuccessDialog({ isOpen: true, message: 'Project updated successfully!' });
//     } catch (error) {
//       setErrorDialog({
//         isOpen: true,
//         message: error.message || 'Failed to update project'
//       });
//     }
//   };

//   if (!project) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Card className="mt-4">
//       <CardHeader>
//         <CardTitle className="text-2xl font-semibold">{project.name}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
//           {/* Image Section */}
//           <div className="space-y-4">
//             <img
//               src={getUploadsUrl(mainImage)}
//               alt={project.name}
//               className="w-full h-32 object-cover overflow-hidden rounded-lg shadow-lg"
//             />
//             <div className="flex flex-wrap gap-2">
//               {project.image && (
//                 <img
//                   src={getUploadsUrl(project.image)}
//                   alt={`${project.name} image`}
//                   className="w-24 h-24 object-cover rounded-lg shadow-md cursor-pointer"
//                   onClick={() => handleImageSelect(project.image)}
//                 />
//               )}
//               {project.image2 && (
//                 <img
//                   src={getUploadsUrl(project.image2)}
//                   alt={`${project.name} image 2`}
//                   className="w-24 h-24 object-cover rounded-lg shadow-md cursor-pointer"
//                   onClick={() => handleImageSelect(project.image2)}
//                 />
//               )}
//               {project.diagram && (
//                 <img
//                   src={getUploadsUrl(project.diagram)}
//                   alt={`${project.name} diagram`}
//                   className="w-24 h-24 object-cover rounded-lg shadow-md cursor-pointer"
//                   onClick={() => handleImageSelect(project.diagram)}
//                 />
//               )}
//             </div>
//           </div>

//           {/* Details Section */}
//           <div className='flex justify-between items-start '>
//           <div className="space-y-4 ">
//             <h3 className="text-xl font-semibold">Price</h3>
//             <p className="text-2xl text-blue-600">${project.price || 'Not set yet'}</p>
//             <p className="text-sm text-green-500 font-medium">{project.status || 'Not set yet'}</p>
//             <h3 className="text-lg font-semibold mt-4">Description</h3>
//             <p className="whitespace-pre-line text-gray-600">
//               {project.description ? cleanDescription(project.description) : 'Not set yet'}
//             </p>
//             <ul className="list-disc list-inside text-gray-700 space-y-1 mt-4">
//               <li>Category: {project.category_name || 'Not set yet'}</li>
//               <li>Components: {project.components || 'Not set yet'}</li>
//             </ul>
//           </div>
//             <Button
//     onClick={() => setIsEditModalOpen(true)}
//     className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg"
//   >
//     Edit
//   </Button>
//         </div>
//         </div>
//       </CardContent>
     

//       {/* Edit Project Modal */}
//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent className="bg-background">
//           <DialogHeader>
//             <DialogTitle className="text-foreground">Edit Project</DialogTitle>
//             <DialogDescription className="text-muted-foreground">
//               Update project details below
//             </DialogDescription>
//           </DialogHeader>
//           <ProjectForm
//             initialData={project}
//             onSubmit={handleUpdateProject}
//             onCancel={() => setIsEditModalOpen(false)}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Notification Dialogs */}
//       <NotificationDialog
//         isOpen={successDialog.isOpen}
//         onClose={() => setSuccessDialog({ ...successDialog, isOpen: false })}
//         message={successDialog.message}
//         type="success"
//       />
//       <NotificationDialog
//         isOpen={errorDialog.isOpen}
//         onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
//         message={errorDialog.message}
//         type="error"
//       />
//     </Card>
//   );
// };

// export default ProjectDetails;