// components/LoadingModal.jsx
"use client";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PuffLoader } from "react-spinners";
import { motion } from "framer-motion";

export function LoadingModal({ isOpen }) {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className="flex items-center justify-center">
                <AlertDialogHeader>
                    <AlertDialogTitle></AlertDialogTitle>
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            <PuffLoader size={48} color="#000000" />
                        </motion.div>
                        <motion.div
                            className="mt-4 text-lg font-semibold text-black"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <span>Loading</span>
                            <span className="inline-block animate-bounce">.</span>
                            <span className="inline-block animate-bounce delay-200">.</span>
                            <span className="inline-block animate-bounce delay-400">.</span>
                        </motion.div>
                    </div>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
}
