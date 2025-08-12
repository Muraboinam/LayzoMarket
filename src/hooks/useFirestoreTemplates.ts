import { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  getAllTemplates, 
  getAppTemplates, 
  getFeaturedAppTemplates,
  getAppTemplatesByCategory,
  searchAppTemplates,
  getWebsiteTemplates,
  getFeaturedWebsiteTemplates,
  getWebsiteTemplatesByCategory,
  searchWebsiteTemplates,
  getComboTemplates,
  getFeaturedComboTemplates,
  getComboTemplatesByCategory,
  searchComboTemplates,
  getN8nWorkflowTemplates,
  getFeaturedN8nWorkflowTemplates,
  getN8nWorkflowTemplatesByCategory,
  searchN8nWorkflowTemplates
} from '../utils/firestoreTemplates';

// Hook for fetching combo templates
export const useComboTemplates = () => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getComboTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch combo templates');
      console.error('Error in useComboTemplates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, loading, error, refetch: fetchTemplates };
};

// Hook for fetching featured combo templates
export const useFeaturedComboTemplates = (limit: number = 4) => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeaturedComboTemplates(limit);
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured combo templates');
        console.error('Error in useFeaturedComboTemplates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTemplates();
  }, [limit]);

  return { templates, loading, error };
};

// Hook for fetching combo templates by category
export const useComboTemplatesByCategory = (category: string | null) => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    const fetchTemplatesByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getComboTemplatesByCategory(category);
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch combo templates by category');
        console.error('Error in useComboTemplatesByCategory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplatesByCategory();
  }, [category]);

  return { templates, loading, error };
};

// Hook for searching combo templates
export const useComboTemplateSearch = () => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTemplates = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setTemplates([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchComboTemplates(searchTerm);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search combo templates');
      console.error('Error in useComboTemplateSearch:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setTemplates([]);
    setError(null);
  };

  return { 
    templates, 
    loading, 
    error, 
    searchTemplates, 
    clearSearch 
  };
};

// Hook for fetching n8n workflow templates
export const useN8nWorkflowTemplates = () => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getN8nWorkflowTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch n8n workflow templates');
      console.error('Error in useN8nWorkflowTemplates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, loading, error, refetch: fetchTemplates };
};

// Hook for fetching featured n8n workflow templates
export const useFeaturedN8nWorkflowTemplates = (limit: number = 4) => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeaturedN8nWorkflowTemplates(limit);
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured n8n workflow templates');
        console.error('Error in useFeaturedN8nWorkflowTemplates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTemplates();
  }, [limit]);

  return { templates, loading, error };
};

// Hook for fetching n8n workflow templates by category
export const useN8nWorkflowTemplatesByCategory = (category: string | null) => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    const fetchTemplatesByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getN8nWorkflowTemplatesByCategory(category);
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch n8n workflow templates by category');
        console.error('Error in useN8nWorkflowTemplatesByCategory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplatesByCategory();
  }, [category]);

  return { templates, loading, error };
};

// Hook for searching n8n workflow templates
export const useN8nWorkflowTemplateSearch = () => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTemplates = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setTemplates([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchN8nWorkflowTemplates(searchTerm);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search n8n workflow templates');
      console.error('Error in useN8nWorkflowTemplateSearch:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setTemplates([]);
    setError(null);
  };

  return { 
    templates, 
    loading, 
    error, 
    searchTemplates, 
    clearSearch 
  };
};

// Hook for fetching all templates
export const useAllTemplates = () => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllTemplates();
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch templates');
        console.error('Error in useAllTemplates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error, refetch: () => fetchTemplates() };
};

// Hook for fetching app templates
export const useAppTemplates = () => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAppTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch app templates');
      console.error('Error in useAppTemplates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, loading, error, refetch: fetchTemplates };
};

// Hook for fetching website templates
export const useWebsiteTemplates = () => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWebsiteTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch website templates');
      console.error('Error in useWebsiteTemplates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, loading, error, refetch: fetchTemplates };
};

// Hook for fetching featured app templates
export const useFeaturedAppTemplates = (limit: number = 4) => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeaturedAppTemplates(limit);
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured app templates');
        console.error('Error in useFeaturedAppTemplates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTemplates();
  }, [limit]);

  return { templates, loading, error };
};

// Hook for fetching featured website templates
export const useFeaturedWebsiteTemplates = (limit: number = 4) => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeaturedWebsiteTemplates(limit);
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured website templates');
        console.error('Error in useFeaturedWebsiteTemplates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTemplates();
  }, [limit]);

  return { templates, loading, error };
};

// Hook for fetching app templates by category
export const useAppTemplatesByCategory = (category: string | null) => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    const fetchTemplatesByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAppTemplatesByCategory(category);
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch templates by category');
        console.error('Error in useAppTemplatesByCategory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplatesByCategory();
  }, [category]);

  return { templates, loading, error };
};

// Hook for fetching website templates by category
export const useWebsiteTemplatesByCategory = (category: string | null) => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    const fetchTemplatesByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWebsiteTemplatesByCategory(category);
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch website templates by category');
        console.error('Error in useWebsiteTemplatesByCategory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplatesByCategory();
  }, [category]);

  return { templates, loading, error };
};

// Hook for searching app templates
export const useAppTemplateSearch = () => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTemplates = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setTemplates([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchAppTemplates(searchTerm);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search templates');
      console.error('Error in useAppTemplateSearch:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setTemplates([]);
    setError(null);
  };

  return { 
    templates, 
    loading, 
    error, 
    searchTemplates, 
    clearSearch 
  };
};

// Hook for searching website templates
export const useWebsiteTemplateSearch = () => {
  const [templates, setTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTemplates = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setTemplates([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchWebsiteTemplates(searchTerm);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search website templates');
      console.error('Error in useWebsiteTemplateSearch:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setTemplates([]);
    setError(null);
  };

  return { 
    templates, 
    loading, 
    error, 
    searchTemplates, 
    clearSearch 
  };
};