"use client";

import useInitialize from "@/hooks/useInitialize";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTeam, setWorkflows } from "@/redux/slice/TeamSlice";
import { useParams } from "next/navigation";

export default function TeamProvider({ children }) {
  const user = useSelector((state) => state.user.user);
  const { loadTeam, loadWorkflow, loadDefaultTemplates, loadMembers } =
    useInitialize();
  const team = useSelector((state) => state.team.team);
  const dispatch = useDispatch();
  const params = useParams();
  useEffect(() => {
    if (user) {
      if (!params?.id) return;

      loadTeam(params.id);
      loadDefaultTemplates();
    }

    return () => {
      dispatch(setTeam(null));
      dispatch(setWorkflows(null));
    };
  }, [user, params?.id]);

  useEffect(() => {
    if (team?.id) {
      loadWorkflow(team.id);
      loadMembers(team.id);
    }

    return () => {
      dispatch(setWorkflows(null));
    };
  }, [team?.id]);

  return <>{children}</>;
}
