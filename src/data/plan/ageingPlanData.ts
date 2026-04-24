export interface AgeingPlanData {
  id: string;
  name: string;
  status: string;
}

export const mockAgeingPlanData: AgeingPlanData[] = [];

export const getAgeingPlanPage = async (params: any) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    list: mockAgeingPlanData,
    total: mockAgeingPlanData.length
  };
};
