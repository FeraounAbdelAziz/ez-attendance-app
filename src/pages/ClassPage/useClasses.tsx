import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export const useClasses = () => {
  const [classes, setClasses] = useState<any>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from('class').select('*');
      setClasses(data);
    };

    fetchClasses();
  }, []);

  return classes;
};