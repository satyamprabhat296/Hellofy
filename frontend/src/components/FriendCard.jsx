

import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { Code2Icon, MessageCircleIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        {/* LANGUAGE BADGES */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 mt-2">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-outline btn-sm flex-1 flex items-center justify-center gap-2"
          >
            <MessageCircleIcon className="size-4" />
            Message
          </Link>

          <Link
            to={`/pair-coding/${friend._id}`}
            className="btn btn-accent btn-sm flex-1 flex items-center justify-center gap-2"
          >
            <Code2Icon className="size-4" />
            Pair Code
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
