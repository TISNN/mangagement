import supabase from '@/lib/supabase';

export const fetchPhdFavorites = async (employeeId: number): Promise<string[]> => {
  const { data, error } = await supabase
    .from('phd_position_favorites')
    .select('position_source_id')
    .eq('employee_id', employeeId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => String(row.position_source_id));
};

export const addPhdFavorite = async (positionSourceId: string, employeeId: number): Promise<void> => {
  const { error } = await supabase
    .from('phd_position_favorites')
    .insert({ position_source_id: positionSourceId, employee_id: employeeId })
    .select('id')
    .single();

  if (error && error.code !== '23505') {
    throw error;
  }
};

export const removePhdFavorite = async (positionSourceId: string, employeeId: number): Promise<void> => {
  const { error } = await supabase
    .from('phd_position_favorites')
    .delete()
    .eq('position_source_id', positionSourceId)
    .eq('employee_id', employeeId);

  if (error) {
    throw error;
  }
};

