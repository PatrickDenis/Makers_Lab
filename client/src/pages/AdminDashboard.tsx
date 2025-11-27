import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Plus, Edit2, Trash2, LogOut, Upload, Image as ImageIcon } from "lucide-react";
import type { Service, Project, Equipment, ProcessStep, Testimonial, ConstructionBanner } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/ObjectUploader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: "",
    description: "",
    icon: "",
    imageUrl: "",
    order: "0"
  });
  
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newTagInput, setNewTagInput] = useState("");
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    category: "",
    description: "",
    tags: [] as string[],
    imageUrl: "",
    order: "0"
  });
  
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [equipmentFormData, setEquipmentFormData] = useState({
    label: "",
    spec: "",
    order: "0"
  });
  
  const [isProcessStepDialogOpen, setIsProcessStepDialogOpen] = useState(false);
  const [editingProcessStep, setEditingProcessStep] = useState<ProcessStep | null>(null);
  const [processStepFormData, setProcessStepFormData] = useState({
    title: "",
    description: "",
    icon: "",
    order: "0"
  });
  
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState({
    quote: "",
    author: "",
    company: "",
    project: "",
    order: "0"
  });
  
  const [bannerFormData, setBannerFormData] = useState({
    enabled: false,
    title: "Site Under Construction",
    subtitle: "We're making some improvements to serve you better!",
    startDate: "",
    endDate: "",
    message: "Some features may be temporarily unavailable during this time. We appreciate your patience."
  });

  const { data: authData, isLoading: isCheckingAuth } = useQuery<{ isAuthenticated: boolean }>({
    queryKey: ["/api/admin/check"],
  });

  const { data: servicesData, isLoading: isLoadingServices } = useQuery<{ success: boolean; services: Service[] }>({
    queryKey: ["/api/services"],
  });
  
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
  });
  
  const { data: equipmentData, isLoading: isLoadingEquipment } = useQuery<{ success: boolean; equipment: Equipment[] }>({
    queryKey: ["/api/equipment"],
  });
  
  const { data: processStepsData, isLoading: isLoadingProcessSteps } = useQuery<{ success: boolean; steps: ProcessStep[] }>({
    queryKey: ["/api/process-steps"],
  });
  
  const { data: testimonialsData, isLoading: isLoadingTestimonials } = useQuery<{ success: boolean; testimonials: Testimonial[] }>({
    queryKey: ["/api/testimonials"],
  });
  
  const { data: bannerData, isLoading: isLoadingBanner } = useQuery<{ success: boolean; banner: ConstructionBanner | null }>({
    queryKey: ["/api/construction-banner"],
  });

  useEffect(() => {
    if (!isCheckingAuth && !authData?.isAuthenticated) {
      setLocation("/admin");
    }
  }, [authData, isCheckingAuth, setLocation]);
  
  useEffect(() => {
    if (bannerData?.banner) {
      setBannerFormData({
        enabled: bannerData.banner.enabled,
        title: bannerData.banner.title,
        subtitle: bannerData.banner.subtitle,
        startDate: bannerData.banner.startDate,
        endDate: bannerData.banner.endDate,
        message: bannerData.banner.message,
      });
    }
  }, [bannerData]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/logout", {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation("/admin");
    },
  });

  // Service Mutations
  const createServiceMutation = useMutation({
    mutationFn: async (data: typeof serviceFormData) => {
      const res = await apiRequest("POST", "/api/services", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service created", description: "The service has been created successfully" });
      resetServiceForm();
      setIsServiceDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create service", variant: "destructive" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof serviceFormData }) => {
      const res = await apiRequest("PUT", `/api/services/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service updated", description: "The service has been updated successfully" });
      resetServiceForm();
      setIsServiceDialogOpen(false);
      setEditingService(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update service", variant: "destructive" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/services/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted", description: "The service has been deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
    },
  });

  // Project Mutations
  const createProjectMutation = useMutation({
    mutationFn: async (data: typeof projectFormData) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created", description: "The project has been created successfully" });
      resetProjectForm();
      setIsProjectDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create project", variant: "destructive" });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof projectFormData }) => {
      const res = await apiRequest("PUT", `/api/projects/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project updated", description: "The project has been updated successfully" });
      resetProjectForm();
      setIsProjectDialogOpen(false);
      setEditingProject(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update project", variant: "destructive" });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/projects/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted", description: "The project has been deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    },
  });

  // Equipment Mutations
  const createEquipmentMutation = useMutation({
    mutationFn: async (data: typeof equipmentFormData) => {
      const res = await apiRequest("POST", "/api/equipment", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({ title: "Equipment created", description: "The equipment has been created successfully" });
      resetEquipmentForm();
      setIsEquipmentDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create equipment", variant: "destructive" });
    },
  });

  const updateEquipmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof equipmentFormData }) => {
      const res = await apiRequest("PUT", `/api/equipment/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({ title: "Equipment updated", description: "The equipment has been updated successfully" });
      resetEquipmentForm();
      setIsEquipmentDialogOpen(false);
      setEditingEquipment(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update equipment", variant: "destructive" });
    },
  });

  const deleteEquipmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/equipment/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({ title: "Equipment deleted", description: "The equipment has been deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete equipment", variant: "destructive" });
    },
  });

  // Process Step Mutations
  const createProcessStepMutation = useMutation({
    mutationFn: async (data: typeof processStepFormData) => {
      const res = await apiRequest("POST", "/api/process-steps", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/process-steps"] });
      toast({ title: "Process step created", description: "The process step has been created successfully" });
      resetProcessStepForm();
      setIsProcessStepDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create process step", variant: "destructive" });
    },
  });

  const updateProcessStepMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof processStepFormData }) => {
      const res = await apiRequest("PUT", `/api/process-steps/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/process-steps"] });
      toast({ title: "Process step updated", description: "The process step has been updated successfully" });
      resetProcessStepForm();
      setIsProcessStepDialogOpen(false);
      setEditingProcessStep(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update process step", variant: "destructive" });
    },
  });

  const deleteProcessStepMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/process-steps/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/process-steps"] });
      toast({ title: "Process step deleted", description: "The process step has been deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete process step", variant: "destructive" });
    },
  });

  // Testimonial Mutations
  const createTestimonialMutation = useMutation({
    mutationFn: async (data: typeof testimonialFormData) => {
      const res = await apiRequest("POST", "/api/testimonials", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial created", description: "The testimonial has been created successfully" });
      resetTestimonialForm();
      setIsTestimonialDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create testimonial", variant: "destructive" });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof testimonialFormData }) => {
      const res = await apiRequest("PUT", `/api/testimonials/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial updated", description: "The testimonial has been updated successfully" });
      resetTestimonialForm();
      setIsTestimonialDialogOpen(false);
      setEditingTestimonial(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update testimonial", variant: "destructive" });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/testimonials/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial deleted", description: "The testimonial has been deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete testimonial", variant: "destructive" });
    },
  });
  
  // Construction Banner Mutation
  const updateBannerMutation = useMutation({
    mutationFn: async (data: typeof bannerFormData) => {
      const res = await apiRequest("PUT", "/api/construction-banner", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/construction-banner"] });
      toast({ title: "Banner updated", description: "The construction banner settings have been saved" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update banner settings", variant: "destructive" });
    },
  });
  
  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBannerMutation.mutate(bannerFormData);
  };

  // Form reset functions
  const resetServiceForm = () => {
    setServiceFormData({ title: "", description: "", icon: "", imageUrl: "", order: "0" });
  };

  const resetProjectForm = () => {
    setProjectFormData({ title: "", category: "", description: "", tags: [], imageUrl: "", order: "0" });
    setNewTagInput("");
  };

  const addProjectTag = () => {
    const tag = newTagInput.trim();
    if (tag && !projectFormData.tags.includes(tag)) {
      setProjectFormData({ ...projectFormData, tags: [...projectFormData.tags, tag] });
      setNewTagInput("");
    }
  };

  const resetEquipmentForm = () => {
    setEquipmentFormData({ label: "", spec: "", order: "0" });
  };

  const resetProcessStepForm = () => {
    setProcessStepFormData({ title: "", description: "", icon: "", order: "0" });
  };

  const resetTestimonialForm = () => {
    setTestimonialFormData({ quote: "", author: "", company: "", project: "", order: "0" });
  };

  // Edit handlers
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      imageUrl: service.imageUrl || "",
      order: service.order
    });
    setIsServiceDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      tags: project.tags || [],
      imageUrl: project.imageUrl,
      order: project.order
    });
    setIsProjectDialogOpen(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setEquipmentFormData({
      label: equipment.label,
      spec: equipment.spec,
      order: equipment.order
    });
    setIsEquipmentDialogOpen(true);
  };

  const handleEditProcessStep = (step: ProcessStep) => {
    setEditingProcessStep(step);
    setProcessStepFormData({
      title: step.title,
      description: step.description,
      icon: step.icon,
      order: step.order
    });
    setIsProcessStepDialogOpen(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialFormData({
      quote: testimonial.quote,
      author: testimonial.author,
      company: testimonial.company,
      project: testimonial.project,
      order: testimonial.order
    });
    setIsTestimonialDialogOpen(true);
  };

  // Submit handlers
  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, data: serviceFormData });
    } else {
      createServiceMutation.mutate(serviceFormData);
    }
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, data: projectFormData });
    } else {
      createProjectMutation.mutate(projectFormData);
    }
  };

  const handleEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEquipment) {
      updateEquipmentMutation.mutate({ id: editingEquipment.id, data: equipmentFormData });
    } else {
      createEquipmentMutation.mutate(equipmentFormData);
    }
  };

  const handleProcessStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProcessStep) {
      updateProcessStepMutation.mutate({ id: editingProcessStep.id, data: processStepFormData });
    } else {
      createProcessStepMutation.mutate(processStepFormData);
    }
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateTestimonialMutation.mutate({ id: editingTestimonial.id, data: testimonialFormData });
    } else {
      createTestimonialMutation.mutate(testimonialFormData);
    }
  };

  if (isCheckingAuth || !authData?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const services = servicesData?.services || [];
  const projects = projectsData?.projects || [];
  const equipment = equipmentData?.equipment || [];
  const processSteps = processStepsData?.steps || [];
  const testimonials = testimonialsData?.testimonials || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your website content</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              data-testid="button-view-site"
            >
              View Site
            </Button>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              data-testid="button-logout"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
            <TabsTrigger value="equipment" data-testid="tab-equipment">Equipment</TabsTrigger>
            <TabsTrigger value="process" data-testid="tab-process">Process</TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="tab-testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="banner" data-testid="tab-banner">Banner</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Services Management</h2>
                  <p className="text-muted-foreground">
                    Add, edit, or remove services displayed on your website
                  </p>
                </div>
                <Button onClick={() => { resetServiceForm(); setEditingService(null); setIsServiceDialogOpen(true); }} data-testid="button-add-service">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {isLoadingServices ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service: Service) => (
                    <Card key={service.id} className="p-6" data-testid={`card-service-${service.id}`}>
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                      <div className="mb-4 text-xs text-muted-foreground">
                        <p>Icon: {service.icon}</p>
                        <p>Order: {service.order}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditService(service)}
                          data-testid={`button-edit-${service.id}`}
                          className="flex-1"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this service?")) {
                              deleteServiceMutation.mutate(service.id);
                            }
                          }}
                          data-testid={`button-delete-${service.id}`}
                          disabled={deleteServiceMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoadingServices && services.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No services yet</p>
                  <Button onClick={() => { resetServiceForm(); setEditingService(null); setIsServiceDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Service
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Projects Management</h2>
                  <p className="text-muted-foreground">
                    Manage portfolio projects showcased on your website
                  </p>
                </div>
                <Button onClick={() => { resetProjectForm(); setEditingProject(null); setIsProjectDialogOpen(true); }} data-testid="button-add-project">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              {isLoadingProjects ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project: Project) => (
                    <Card key={project.id} className="p-6" data-testid={`card-project-${project.id}`}>
                      {project.imageUrl && (
                        <img src={project.imageUrl} alt={project.title} className="w-full h-32 object-cover rounded-md mb-4" />
                      )}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{project.category}</Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      <div className="mb-4 text-xs text-muted-foreground">
                        <p>Order: {project.order}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                          data-testid={`button-edit-${project.id}`}
                          className="flex-1"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this project?")) {
                              deleteProjectMutation.mutate(project.id);
                            }
                          }}
                          data-testid={`button-delete-${project.id}`}
                          disabled={deleteProjectMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoadingProjects && projects.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No projects yet</p>
                  <Button onClick={() => { resetProjectForm(); setEditingProject(null); setIsProjectDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Project
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Equipment Management</h2>
                  <p className="text-muted-foreground">
                    Manage technical specifications and capabilities
                  </p>
                </div>
                <Button onClick={() => { resetEquipmentForm(); setEditingEquipment(null); setIsEquipmentDialogOpen(true); }} data-testid="button-add-equipment">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Equipment
                </Button>
              </div>

              {isLoadingEquipment ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {equipment.map((item: Equipment) => (
                    <Card key={item.id} className="p-6" data-testid={`card-equipment-${item.id}`}>
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">{item.label}</h3>
                        <p className="font-mono text-sm text-muted-foreground">
                          {item.spec}
                        </p>
                      </div>
                      <div className="mb-4 text-xs text-muted-foreground">
                        <p>Order: {item.order}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEquipment(item)}
                          data-testid={`button-edit-${item.id}`}
                          className="flex-1"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this equipment?")) {
                              deleteEquipmentMutation.mutate(item.id);
                            }
                          }}
                          data-testid={`button-delete-${item.id}`}
                          disabled={deleteEquipmentMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoadingEquipment && equipment.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No equipment yet</p>
                  <Button onClick={() => { resetEquipmentForm(); setEditingEquipment(null); setIsEquipmentDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Equipment
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Process Steps Tab */}
          <TabsContent value="process">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Process Steps Management</h2>
                  <p className="text-muted-foreground">
                    Manage your fabrication process workflow
                  </p>
                </div>
                <Button onClick={() => { resetProcessStepForm(); setEditingProcessStep(null); setIsProcessStepDialogOpen(true); }} data-testid="button-add-process-step">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Process Step
                </Button>
              </div>

              {isLoadingProcessSteps ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {processSteps.map((step: ProcessStep) => (
                    <Card key={step.id} className="p-6" data-testid={`card-process-step-${step.id}`}>
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {step.description}
                        </p>
                      </div>
                      <div className="mb-4 text-xs text-muted-foreground">
                        <p>Icon: {step.icon}</p>
                        <p>Order: {step.order}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProcessStep(step)}
                          data-testid={`button-edit-${step.id}`}
                          className="flex-1"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this process step?")) {
                              deleteProcessStepMutation.mutate(step.id);
                            }
                          }}
                          data-testid={`button-delete-${step.id}`}
                          disabled={deleteProcessStepMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoadingProcessSteps && processSteps.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No process steps yet</p>
                  <Button onClick={() => { resetProcessStepForm(); setEditingProcessStep(null); setIsProcessStepDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Process Step
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Testimonials Management</h2>
                  <p className="text-muted-foreground">
                    Manage client testimonials and reviews
                  </p>
                </div>
                <Button onClick={() => { resetTestimonialForm(); setEditingTestimonial(null); setIsTestimonialDialogOpen(true); }} data-testid="button-add-testimonial">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>

              {isLoadingTestimonials ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial: Testimonial) => (
                    <Card key={testimonial.id} className="p-6" data-testid={`card-testimonial-${testimonial.id}`}>
                      <div className="mb-4">
                        <blockquote className="text-sm leading-relaxed mb-4 italic line-clamp-3">
                          "{testimonial.quote}"
                        </blockquote>
                        <p className="font-semibold text-base">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          Project: {testimonial.project}
                        </p>
                      </div>
                      <div className="mb-4 text-xs text-muted-foreground">
                        <p>Order: {testimonial.order}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTestimonial(testimonial)}
                          data-testid={`button-edit-${testimonial.id}`}
                          className="flex-1"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this testimonial?")) {
                              deleteTestimonialMutation.mutate(testimonial.id);
                            }
                          }}
                          data-testid={`button-delete-${testimonial.id}`}
                          disabled={deleteTestimonialMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoadingTestimonials && testimonials.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No testimonials yet</p>
                  <Button onClick={() => { resetTestimonialForm(); setEditingTestimonial(null); setIsTestimonialDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Testimonial
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Construction Banner Tab */}
          <TabsContent value="banner">
            <div className="mb-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Construction Banner Settings</h2>
                <p className="text-muted-foreground">
                  Control the site-wide construction/maintenance banner displayed to visitors
                </p>
              </div>

              {isLoadingBanner ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <Card className="p-6 max-w-2xl">
                  <form onSubmit={handleBannerSubmit} className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label htmlFor="banner-enabled" className="text-base font-semibold">
                          Enable Construction Banner
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          When enabled, visitors will see a construction overlay on the site
                        </p>
                      </div>
                      <Switch
                        id="banner-enabled"
                        checked={bannerFormData.enabled}
                        onCheckedChange={(checked) => setBannerFormData({ ...bannerFormData, enabled: checked })}
                        data-testid="switch-banner-enabled"
                      />
                    </div>

                    <div>
                      <Label htmlFor="banner-title">Banner Title</Label>
                      <Input
                        id="banner-title"
                        value={bannerFormData.title}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                        placeholder="Site Under Construction"
                        data-testid="input-banner-title"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="banner-subtitle">Subtitle</Label>
                      <Input
                        id="banner-subtitle"
                        value={bannerFormData.subtitle}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                        placeholder="We're making some improvements to serve you better!"
                        data-testid="input-banner-subtitle"
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="banner-start-date">Start Date</Label>
                        <Input
                          id="banner-start-date"
                          value={bannerFormData.startDate}
                          onChange={(e) => setBannerFormData({ ...bannerFormData, startDate: e.target.value })}
                          placeholder="November 21"
                          data-testid="input-banner-start-date"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner-end-date">End Date</Label>
                        <Input
                          id="banner-end-date"
                          value={bannerFormData.endDate}
                          onChange={(e) => setBannerFormData({ ...bannerFormData, endDate: e.target.value })}
                          placeholder="November 30"
                          data-testid="input-banner-end-date"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="banner-message">Additional Message</Label>
                      <Textarea
                        id="banner-message"
                        value={bannerFormData.message}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, message: e.target.value })}
                        placeholder="Some features may be temporarily unavailable during this time. We appreciate your patience."
                        data-testid="textarea-banner-message"
                        className="mt-2 min-h-24"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={updateBannerMutation.isPending}
                      data-testid="button-save-banner"
                      className="w-full"
                    >
                      {updateBannerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Banner Settings"
                      )}
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-edit-service">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService ? "Update the service details below" : "Create a new service by filling out the form below"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={serviceFormData.title}
                onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                placeholder="Laser Cutting"
                required
                data-testid="input-service-title"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={serviceFormData.description}
                onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                placeholder="Precision laser cutting for metal, acrylic, and wood..."
                required
                data-testid="textarea-service-description"
                className="mt-2 min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon Name *</Label>
              <Input
                id="icon"
                value={serviceFormData.icon}
                onChange={(e) => setServiceFormData({ ...serviceFormData, icon: e.target.value })}
                placeholder="Scissors (Lucide icon name)"
                required
                data-testid="input-service-icon"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use Lucide React icon names (e.g., Scissors, Cog, Box, Flame)
              </p>
            </div>

            <div>
              <Label htmlFor="imageUrl">Service Image (optional)</Label>
              <div className="mt-2 space-y-3">
                {serviceFormData.imageUrl && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                    <img
                      src={serviceFormData.imageUrl}
                      alt="Service preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <ImageUploader
                    currentImageUrl={serviceFormData.imageUrl}
                    onUploadComplete={(url) => setServiceFormData({ ...serviceFormData, imageUrl: url })}
                    buttonText="Upload Image"
                  />
                  <span className="text-sm text-muted-foreground">or</span>
                  <Input
                    id="imageUrl"
                    value={serviceFormData.imageUrl}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                    data-testid="input-service-image"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload an image or enter a URL directly
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="order">Display Order *</Label>
              <Input
                id="order"
                value={serviceFormData.order}
                onChange={(e) => setServiceFormData({ ...serviceFormData, order: e.target.value })}
                placeholder="1"
                required
                data-testid="input-service-order"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsServiceDialogOpen(false);
                  setEditingService(null);
                  resetServiceForm();
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="button-save-service"
                disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
              >
                {(createServiceMutation.isPending || updateServiceMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingService ? (
                  "Update Service"
                ) : (
                  "Create Service"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-edit-project">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? "Update the project details below" : "Create a new project by filling out the form below"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <div>
              <Label htmlFor="project-title">Title *</Label>
              <Input
                id="project-title"
                value={projectFormData.title}
                onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                placeholder="Precision Industrial Components"
                required
                data-testid="input-project-title"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="project-category">Category *</Label>
              <Input
                id="project-category"
                value={projectFormData.category}
                onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                placeholder="Industrial"
                required
                data-testid="input-project-category"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="project-description">Description *</Label>
              <Textarea
                id="project-description"
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                placeholder="CNC machined aluminum parts with tight tolerances..."
                required
                data-testid="textarea-project-description"
                className="mt-2 min-h-24"
              />
            </div>

            <div>
              <Label>Tags *</Label>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="project-tag-input"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="Add a tag (press Enter)"
                    data-testid="input-project-tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addProjectTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addProjectTag}
                    data-testid="button-add-tag"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projectFormData.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1" data-testid={`badge-tag-${idx}`}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          setProjectFormData({
                            ...projectFormData,
                            tags: projectFormData.tags.filter((_, i) => i !== idx)
                          });
                        }}
                        className="ml-1 hover-elevate rounded-full"
                        data-testid={`button-remove-tag-${idx}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                {projectFormData.tags.length === 0 && (
                  <p className="text-xs text-muted-foreground">No tags added yet. Add at least one tag.</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="project-imageUrl">Project Image *</Label>
              <div className="mt-2 space-y-3">
                {projectFormData.imageUrl && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                    <img
                      src={projectFormData.imageUrl}
                      alt="Project preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <ImageUploader
                    currentImageUrl={projectFormData.imageUrl}
                    onUploadComplete={(url) => setProjectFormData({ ...projectFormData, imageUrl: url })}
                    buttonText="Upload Image"
                  />
                  <span className="text-sm text-muted-foreground">or</span>
                  <Input
                    id="project-imageUrl"
                    value={projectFormData.imageUrl}
                    onChange={(e) => setProjectFormData({ ...projectFormData, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                    data-testid="input-project-image"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload an image or enter a URL directly
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="project-order">Display Order *</Label>
              <Input
                id="project-order"
                value={projectFormData.order}
                onChange={(e) => setProjectFormData({ ...projectFormData, order: e.target.value })}
                placeholder="1"
                required
                data-testid="input-project-order"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsProjectDialogOpen(false);
                  setEditingProject(null);
                  resetProjectForm();
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="button-save-project"
                disabled={createProjectMutation.isPending || updateProjectMutation.isPending || projectFormData.tags.length === 0}
              >
                {(createProjectMutation.isPending || updateProjectMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingProject ? (
                  "Update Project"
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Equipment Dialog */}
      <Dialog open={isEquipmentDialogOpen} onOpenChange={setIsEquipmentDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-edit-equipment">
          <DialogHeader>
            <DialogTitle>
              {editingEquipment ? "Edit Equipment" : "Add New Equipment"}
            </DialogTitle>
            <DialogDescription>
              {editingEquipment ? "Update the equipment details below" : "Create a new equipment capability by filling out the form below"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEquipmentSubmit} className="space-y-4">
            <div>
              <Label htmlFor="equipment-label">Label *</Label>
              <Input
                id="equipment-label"
                value={equipmentFormData.label}
                onChange={(e) => setEquipmentFormData({ ...equipmentFormData, label: e.target.value })}
                placeholder="Laser Cutting"
                required
                data-testid="input-equipment-label"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="equipment-spec">Specification *</Label>
              <Input
                id="equipment-spec"
                value={equipmentFormData.spec}
                onChange={(e) => setEquipmentFormData({ ...equipmentFormData, spec: e.target.value })}
                placeholder='Up to 1/2" steel, 1" acrylic'
                required
                data-testid="input-equipment-spec"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="equipment-order">Display Order *</Label>
              <Input
                id="equipment-order"
                value={equipmentFormData.order}
                onChange={(e) => setEquipmentFormData({ ...equipmentFormData, order: e.target.value })}
                placeholder="1"
                required
                data-testid="input-equipment-order"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEquipmentDialogOpen(false);
                  setEditingEquipment(null);
                  resetEquipmentForm();
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="button-save-equipment"
                disabled={createEquipmentMutation.isPending || updateEquipmentMutation.isPending}
              >
                {(createEquipmentMutation.isPending || updateEquipmentMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingEquipment ? (
                  "Update Equipment"
                ) : (
                  "Create Equipment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Process Step Dialog */}
      <Dialog open={isProcessStepDialogOpen} onOpenChange={setIsProcessStepDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-edit-process-step">
          <DialogHeader>
            <DialogTitle>
              {editingProcessStep ? "Edit Process Step" : "Add New Process Step"}
            </DialogTitle>
            <DialogDescription>
              {editingProcessStep ? "Update the process step details below" : "Create a new process step by filling out the form below"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProcessStepSubmit} className="space-y-4">
            <div>
              <Label htmlFor="step-title">Title *</Label>
              <Input
                id="step-title"
                value={processStepFormData.title}
                onChange={(e) => setProcessStepFormData({ ...processStepFormData, title: e.target.value })}
                placeholder="Consultation"
                required
                data-testid="input-step-title"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="step-description">Description *</Label>
              <Textarea
                id="step-description"
                value={processStepFormData.description}
                onChange={(e) => setProcessStepFormData({ ...processStepFormData, description: e.target.value })}
                placeholder="Discuss your project requirements..."
                required
                data-testid="textarea-step-description"
                className="mt-2 min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="step-icon">Icon Name *</Label>
              <Input
                id="step-icon"
                value={processStepFormData.icon}
                onChange={(e) => setProcessStepFormData({ ...processStepFormData, icon: e.target.value })}
                placeholder="MessageSquare (Lucide icon name)"
                required
                data-testid="input-step-icon"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use Lucide React icon names (e.g., MessageSquare, Pencil, Wrench, Truck)
              </p>
            </div>

            <div>
              <Label htmlFor="step-order">Display Order *</Label>
              <Input
                id="step-order"
                value={processStepFormData.order}
                onChange={(e) => setProcessStepFormData({ ...processStepFormData, order: e.target.value })}
                placeholder="1"
                required
                data-testid="input-step-order"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsProcessStepDialogOpen(false);
                  setEditingProcessStep(null);
                  resetProcessStepForm();
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="button-save-process-step"
                disabled={createProcessStepMutation.isPending || updateProcessStepMutation.isPending}
              >
                {(createProcessStepMutation.isPending || updateProcessStepMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingProcessStep ? (
                  "Update Process Step"
                ) : (
                  "Create Process Step"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-edit-testimonial">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
            <DialogDescription>
              {editingTestimonial ? "Update the testimonial details below" : "Create a new testimonial by filling out the form below"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTestimonialSubmit} className="space-y-4">
            <div>
              <Label htmlFor="testimonial-quote">Quote *</Label>
              <Textarea
                id="testimonial-quote"
                value={testimonialFormData.quote}
                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, quote: e.target.value })}
                placeholder="The precision and attention to detail exceeded our requirements..."
                required
                data-testid="textarea-testimonial-quote"
                className="mt-2 min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="testimonial-author">Author Name *</Label>
              <Input
                id="testimonial-author"
                value={testimonialFormData.author}
                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, author: e.target.value })}
                placeholder="Sarah Chen"
                required
                data-testid="input-testimonial-author"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="testimonial-company">Company *</Label>
              <Input
                id="testimonial-company"
                value={testimonialFormData.company}
                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, company: e.target.value })}
                placeholder="AeroTech Industries"
                required
                data-testid="input-testimonial-company"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="testimonial-project">Project *</Label>
              <Input
                id="testimonial-project"
                value={testimonialFormData.project}
                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, project: e.target.value })}
                placeholder="Aerospace Components"
                required
                data-testid="input-testimonial-project"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="testimonial-order">Display Order *</Label>
              <Input
                id="testimonial-order"
                value={testimonialFormData.order}
                onChange={(e) => setTestimonialFormData({ ...testimonialFormData, order: e.target.value })}
                placeholder="1"
                required
                data-testid="input-testimonial-order"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsTestimonialDialogOpen(false);
                  setEditingTestimonial(null);
                  resetTestimonialForm();
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="button-save-testimonial"
                disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
              >
                {(createTestimonialMutation.isPending || updateTestimonialMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingTestimonial ? (
                  "Update Testimonial"
                ) : (
                  "Create Testimonial"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
