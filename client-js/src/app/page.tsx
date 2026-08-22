'use client';

import { ArrowRight, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, createProjectCode } from '../features/project/projectThunk';
import { useRouter } from 'next/navigation';
import LandingLoader from '../components/LandingLoader';
import Fireflies from '../components/Fireflies';
import { AppDispatch, RootState } from '../app/store';

export default function HomePage() {
  const { project } = useSelector((state: RootState) => state.project);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    try {
      await dispatch(createProject({ input })).unwrap();
      toast('Creating Website!');
    } catch (error: any) {
      console.error('Create project failed:', error);
      toast(error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?.project?._id) {
      dispatch(
        createProjectCode({
          enhanceResponse: project.enhanceResponse,
          projectId: project.project._id,
        })
      );

      router.push(`/projects/${project.project._id}`);
    }
  }, [project, dispatch, router]);

  return (
    <section className="relative flex flex-col items-center text-white gap-8 px-4 pt-32 mt-10 pb-24 overflow-hidden font-poppins min-h-[85vh]">
      <LandingLoader />
      <div className="
        pointer-events-none
        fixed inset-0
        -z-10
        flex items-center justify-center
      ">
        <div className="
          w-[700px] h-[700px]
          rounded-full
          bg-lime-500/20
          blur-[160px]
        " />
      </div>
      <Fireflies count={20} />
      {/* Neon Label */}
      <div>
        <span className="
          inline-block
          font-bold
          text-sm uppercase tracking-widest
          text-lime-400
          px-4 py-1
        ">
          Build Boldly, Lead Honestly
        </span>
      </div>

      {/* Heading */}
      <h1 className="
        text-center
        text-[42px] leading-[48px]
        md:text-[80px] md:leading-[72px]
        font-bold
        max-w-4xl
      ">
        Transform Ideas into Websites, with AI
      </h1>

      {/* Subtitle */}
      <p className="
        text-center
        text-white/70
        text-base
        md:text-lg
        max-w-xl
        mt-4
      ">
        Design, Personalize, and Launch Sites Faster Than Ever <br className="hidden md:block" /> with Our AI Website Builder
      </p>

      {/* CTA / Form */}
      <form
        onSubmit={onSubmitHandler}
        className="
          relative
          mt-12
          w-full max-w-3xl
          backdrop-blur-xl
          bg-black/50
          border border-white/15
          rounded-4xl
          p-4
          shadow-[0_20px_60px_rgba(0,0,0,0.4)]
          focus-within:ring-2
          ring-lime-400/50
          transition
        "
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="Describe your website idea in detail"
          required
          className="
            w-full
            resize-none
            bg-transparent
            outline-none
            text-white
            placeholder:text-white/40
          "
        />

        <div className="flex justify-end mt-3 group">
          <button
            type="submit"
            disabled={loading}
            className="
              hidden lg:flex items-center justify-around gap-3
              px-1 py-1
              rounded-full
              bg-lime-400 text-black
              text-sm font-extrabold
              transition-all duration-300
              shadow-[0_0_15px_rgba(163,230,53,0.6),0_0_40px_rgba(163,230,53,0.35)]
              hover:shadow-[0_0_25px_rgba(163,230,53,0.9),0_0_60px_rgba(163,230,53,0.6)]
              hover:bg-lime-300
              disabled:opacity-50
            "
          >
            {!loading ? (
              <>
                <span className="pl-4 h-8 flex items-center justify-center text-black">
                  Create with AI
                </span>

                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-black/90 text-lime-400">
                  <ArrowRight />
                </span>
              </>
            ) : (
              <>
                <span className="pl-4 h-8 flex items-center justify-center text-black">
                  Creating
                </span>

                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-black/90 text-lime-400">
                  <Loader2Icon className="animate-spin" />
                </span>
              </>
            )}
          </button>

          {/* Mobile Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              lg:hidden flex items-center gap-2
              px-5 py-2.5 rounded-full
              bg-lime-400 text-black font-extrabold text-sm
              shadow-[0_0_15px_rgba(163,230,53,0.6)]
            "
          >
            {loading ? 'Creating...' : 'Create with AI'}
          </button>

          <span
            className="
              absolute
              right-14
              top-1/2
              -translate-y-1/2
              whitespace-nowrap
              rounded-md
              bg-black
              px-3
              py-1.5
              text-xs
              font-medium
              text-white
              opacity-0
              scale-95
              group-hover:opacity-100
              group-hover:scale-100
              transition
              pointer-events-none
              hidden lg:block
            "
          >
            {!loading ? '-5 Credits' : 'wait!'}
          </span>
        </div>
      </form>
    </section>
  );
}
