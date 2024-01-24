export function Chat({
    who,
    message,
  }: {
    who: string
    message: string
  }) {
    return ( 
        <div className="flex items-start gap-4 mb-4">
        <img
          className="rounded-full"
          height="50"
          src={`https://eu.ui-avatars.com/api/?name=${who === 'You' ? 'you' : 'bot'}&size=50`}
          style={{
            aspectRatio: "50/50",
            objectFit: "cover",
          }}
          width="50"
        />
        <div className="flex flex-col">
          <div className="text-white">{who === 'You' ? 'You' : 'Mixorai Bot'}</div>
          <div className="bg-gray-700 text-white rounded-lg p-2">
            {message}
          </div>
        </div>
      </div>
     );
}