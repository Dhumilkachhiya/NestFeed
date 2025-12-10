import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpen }) => {

    const [text,setText] = useState("");
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        }else{
            setText("")
        }
    }

    const sendMessegeHandler = async () =>{
        alert(text)
    }

   return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-0 rounded-lg w-[800px] h-[600px] flex flex-col z-50"
      >
        <div className="flex flex-1">
          {/* Image */}
          <div className="w-1/2">
            <img
              src="https://images.pexels.com/photos/4345410/pexels-photo-4345410.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="post_image"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Comment Section */}
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar className="relative z-10">
                    <AvatarImage />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">username</Link>
                </div>
              </div>

              {/* More menu (Fixed) */}
              <Popover>
                <PopoverTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="bg-white shadow-lg border rounded-md p-2 w-40 flex flex-col text-sm"
                >
                  <Button
                    variant="ghost"
                    className="w-full text-red-500 font-bold"
                  >
                    Unfollow
                  </Button>
                  <Button variant="ghost" className="w-full">
                    Add to favorites
                  </Button>
                  <Button variant="ghost" className="w-full text-gray-600">
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </div>

            <hr />
            <div className="flex overflow-y-auto max-h-96 p-4">Comments</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={changeEventHandler}
                placeholder="Add a comment..."
                className="w-full outline-none border border-gray-300 p-2 rounded ml-2"
              />
              <Button disabled={!text.trim()} onClick={sendMessegeHandler} variant="outline">Send</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
