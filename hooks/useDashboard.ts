'use client'

import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"
import { DashboardData } from "@/types/dashboard";

export default function useDashboard(userId?:string){
  return useQuery<DashboardData>({
    queryKey:["dashboard",userId],
    queryFn:async()=>{
      const res=await api.get(`/transactions?userId=${userId}`)
      return res.data.data
    },
    enabled:!!userId,
    staleTime:1000*60*5,
    refetchOnWindowFocus:false
  })
}