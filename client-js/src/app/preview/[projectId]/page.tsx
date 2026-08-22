'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { getProject } from '../../../features/project/projectThunk';
import { Loader2Icon } from 'lucide-react';
import ProjectPreview from '../../../components/ProjectPreview';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { AppDispatch } from '../../../app/store';

export default function PreviewPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const fetchCode = async () => {
    if (!projectId) return;
    try {
      const res: any = await dispatch(
        getProject({ projectId })
      ).unwrap();

      const projectData = res?.project || res;
      setCode(projectData?.current_code);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCode();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2Icon className="size-7 animate-spin text-indigo-200" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen w-screen flex flex-col bg-black">
        {code && (
          <ProjectPreview
            project={{ current_code: code }}
            isGenerating={false}
            showEditorPanel={false}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
