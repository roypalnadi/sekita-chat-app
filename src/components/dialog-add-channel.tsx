import { Dispatch, SetStateAction, useRef } from 'react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function DialogAddChannel({
    createChannel,
    open,
    setOpen,
}: {
    createChannel: (userCode: string) => void;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const addUserCode = useRef<string>('');
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                        Add user to start chat. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            User UID
                        </Label>
                        <Input
                            className="col-span-3"
                            onChange={(e) => {
                                addUserCode.current = e.target.value;
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className="bg-emerald-500 hover:bg-emerald-500/80"
                        onClick={() => createChannel(addUserCode.current)}
                    >
                        New Chat
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
