import React from 'react';

export const FloralDecoration: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 180C40 120 100 80 180 60"
        stroke="#A4B494"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 4"
      />
      <path
        d="M20 180C60 140 120 120 190 140"
        stroke="#C9B79C"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M70 145C60 135 65 120 75 125C85 130 80 145 70 145Z"
        fill="#A4B494"
        opacity="0.8"
      />
      <path
        d="M110 130C100 120 105 105 115 110C125 115 120 130 110 130Z"
        fill="#A4B494"
        opacity="0.8"
      />
      <path
        d="M150 132C145 120 152 110 160 115C168 120 162 135 150 132Z"
        fill="#8CA489"
        opacity="0.9"
      />
      {/* Flowers */}
      <circle cx="100" cy="85" r="10" fill="#D4A373" opacity="0.3" />
      <circle cx="100" cy="85" r="5" fill="#D4A373" />
      <circle cx="90" cy="80" r="4" fill="#E6CCB2" />
      <circle cx="110" cy="90" r="4" fill="#E6CCB2" />
      <circle cx="105" cy="76" r="4" fill="#E6CCB2" />
      <circle cx="95" cy="94" r="4" fill="#E6CCB2" />

      <circle cx="150" cy="70" r="12" fill="#C9B79C" opacity="0.3" />
      <circle cx="150" cy="70" r="6" fill="#C9B79C" />
      <circle cx="140" cy="65" r="5" fill="#F5EBE0" />
      <circle cx="160" cy="75" r="5" fill="#F5EBE0" />
      <circle cx="155" cy="60" r="5" fill="#F5EBE0" />
      <circle cx="145" cy="80" r="5" fill="#F5EBE0" />
    </svg>
  );
};

export const SplashBird: React.FC = () => {
  return (
    <svg
      className="w-48 h-48 mx-auto filter drop-shadow-md"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background soft glow */}
      <circle cx="100" cy="100" r="80" fill="#F5EBE0" opacity="0.6" />
      
      {/* Branches */}
      <path
        d="M30 140C60 130 110 120 170 125"
        stroke="#8B7355"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M110 122C120 110 140 100 150 105"
        stroke="#8B7355"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Leaves */}
      <path d="M50 132C42 124 45 112 55 118C65 124 58 136 50 132Z" fill="#A4B494" />
      <path d="M80 124C75 115 80 105 90 110C100 115 92 126 80 124Z" fill="#8CA489" />
      <path d="M130 112C125 100 132 90 142 95C152 100 142 115 130 112Z" fill="#A4B494" />
      <path d="M155 114C150 104 158 96 166 102C174 108 165 118 155 114Z" fill="#8CA489" />

      {/* Little flower buds */}
      <circle cx="75" cy="115" r="4" fill="#D4A373" />
      <circle cx="145" cy="100" r="5" fill="#D4A373" />
      <circle cx="148" cy="97" r="2" fill="#E6CCB2" />
      
      {/* Cute Bird */}
      {/* Tail */}
      <path
        d="M65 105C50 120 40 135 42 140C44 145 55 130 70 115Z"
        fill="#5C7A92"
      />
      <path
        d="M62 108C50 123 45 132 47 135C49 138 58 125 67 113Z"
        fill="#8DA4C4"
      />
      
      {/* Body */}
      <ellipse cx="100" cy="100" rx="35" ry="25" fill="#8DA4C4" />
      {/* Breast (lighter blue/cream) */}
      <path
        d="M95 123C115 123 130 115 130 100C130 85 115 90 95 90C75 90 75 123 95 123Z"
        fill="#F5EBE0"
        opacity="0.9"
      />
      <path
        d="M100 125C115 125 125 118 125 105C125 98 115 102 100 102C85 102 85 125 100 125Z"
        fill="#E6CCB2"
        opacity="0.7"
      />

      {/* Head */}
      <circle cx="120" cy="85" r="18" fill="#5C7A92" />
      {/* Eye */}
      <circle cx="126" cy="82" r="2.5" fill="#2C3E50" />
      <circle cx="127" cy="81" r="0.8" fill="#FFFFFF" />
      
      {/* Beak */}
      <path
        d="M136 84L144 87L136 91Z"
        fill="#D4A373"
      />
      
      {/* Wing */}
      <path
        d="M80 100C80 90 105 85 110 102C112 110 95 115 80 100Z"
        fill="#4A6275"
      />
      <path
        d="M85 100C85 93 100 90 103 102C105 107 95 110 85 100Z"
        fill="#8DA4C4"
        opacity="0.5"
      />
    </svg>
  );
};

export const OnboardingGirl: React.FC = () => {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background ambient glow */}
      <circle cx="140" cy="140" r="115" fill="#FDFBF9" opacity="0.9" />
      <circle cx="140" cy="140" r="100" fill="#FBF6EE" opacity="0.65" />
      
      {/* Wooden Desk Surface with soft grain lines */}
      <path d="M 15 240 L 265 240" stroke="#A78B71" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 25 244 L 255 244" stroke="#C6B5A2" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M 45 248 L 235 248" stroke="#C6B5A2" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

      {/* PLANT POT (LEFT) */}
      {/* Shadow */}
      <ellipse cx="60" cy="241" rx="18" ry="4" fill="#604E40" opacity="0.12" />
      {/* Potted Pilea Peperomioides plant in cream ceramic pot */}
      <path d="M 46 200 L 50 240 C 51 241 71 241 72 240 L 76 200 Z" fill="#F3EFE9" stroke="#7A6553" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="61" cy="200" rx="15" ry="4" fill="#E3DDD3" stroke="#7A6553" strokeWidth="1.2" />
      {/* Dark soil inside pot */}
      <ellipse cx="61" cy="201" rx="13.5" ry="3" fill="#5A4738" />

      {/* Plant Stems and Leaves */}
      {/* Stem 1 & leaf */}
      <path d="M 61 200 Q 50 178 35 180" stroke="#5C6E52" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="180" r="9.5" fill="#758B6B" stroke="#4F6049" strokeWidth="1.2" />
      <circle cx="31" cy="178" r="2.5" fill="#91A787" opacity="0.6" />
      
      {/* Stem 2 & leaf */}
      <path d="M 61 200 Q 42 165 46 148" stroke="#5C6E52" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="47" cy="146" r="12" fill="#859E7B" stroke="#4F6049" strokeWidth="1.2" />
      <circle cx="44" cy="143" r="3" fill="#9FBA94" opacity="0.6" />

      {/* Stem 3 & leaf */}
      <path d="M 61 200 Q 72 170 82 160" stroke="#5C6E52" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="84" cy="158" r="10" fill="#6A8261" stroke="#4F6049" strokeWidth="1.2" />

      {/* Stem 4 & leaf drooping down */}
      <path d="M 61 200 Q 74 210 78 222" stroke="#5C6E52" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="79" cy="225" r="8" fill="#586C4F" stroke="#4F6049" strokeWidth="1" />

      {/* Stem 5 & small leaf drooping left */}
      <path d="M 61 200 Q 38 215 32 222" stroke="#5C6E52" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="31" cy="224" r="7" fill="#6F8565" stroke="#4F6049" strokeWidth="1" />

      {/* BURNING CANDLE JAR (NEXT TO PLANT) */}
      {/* Amber jar candle */}
      <rect x="88" y="210" width="18" height="30" rx="3" fill="#D39D6F" stroke="#8A6341" strokeWidth="1.2" />
      {/* Metal lid or collar */}
      <rect x="86" y="207" width="22" height="3" rx="1" fill="#7A6855" />
      {/* Label */}
      <rect x="91" y="218" width="12" height="15" fill="#FDFBF9" rx="1" />
      <line x1="93" y1="222" x2="101" y2="222" stroke="#8A6341" strokeWidth="0.8" />
      <line x1="93" y1="226" x2="101" y2="226" stroke="#8A6341" strokeWidth="0.8" />
      {/* Flame & Glow */}
      <circle cx="97" cy="201" r="5" fill="#FED880" opacity="0.3" />
      <path d="M 97 205 Q 96 200 97 197 Q 98 200 97 205" fill="#E67E22" />
      <circle cx="97" cy="203" r="1.5" fill="#FFF2CC" />

      {/* DRIED FLOWER VASE IN BACK (BEHIND JOURNAL) */}
      <path d="M 104 200 C 104 185 108 175 110 160" stroke="#7A6855" strokeWidth="1.2" fill="none" />
      <circle cx="110" cy="158" r="4" fill="#D4A373" />
      <path d="M 112 185 C 118 175 120 165 125 155" stroke="#5C6E52" strokeWidth="1" fill="none" />
      <circle cx="126" cy="153" r="3" fill="#D29B9B" />

      {/* COZY COFFEE CUP WITH LATTE ART (RIGHT) */}
      {/* Shadow */}
      <ellipse cx="215" cy="240" rx="20" ry="4" fill="#604E40" opacity="0.12" />
      {/* Cup Base */}
      <path d="M 194 200 C 194 185 198 175 215 175 C 232 175 236 185 236 200 C 236 215 231 240 215 240 C 199 240 194 215 194 200 Z" fill="#EDE9E3" stroke="#8B7355" strokeWidth="1.5" />
      {/* Cup Handle */}
      <path d="M 235 192 C 243 192 248 196 248 202 C 248 208 243 212 235 212" stroke="#EDE9E3" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 235 192 C 243 192 248 196 248 202 C 248 208 243 212 235 212" stroke="#8B7355" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Latte liquid */}
      <ellipse cx="215" cy="180" rx="17" ry="5.5" fill="#8F6347" stroke="#704A33" strokeWidth="1" />
      {/* Latte Art (Cozy Heart) */}
      <path d="M 211 179 C 211 176 215 175 215 178 C 215 175 219 176 219 179 C 219 181 215 183 215 183 C 215 183 211 181 211 179 Z" fill="#FCFAF7" />
      <path d="M 215 177 L 215 184" stroke="#FCFAF7" strokeWidth="0.8" />
      {/* Inscribed "COZY" on the mug */}
      <text x="207" y="210" fill="#8B7355" fontFamily="sans-serif" fontSize="6.5" fontWeight="bold" letterSpacing="0.8">COZY</text>

      {/* COZY GIRL CHARACTER WRITING */}
      {/* Back Torso & Shoulders in soft knitted cream-colored cardigan */}
      <path d="M 125 240 C 120 205 130 155 160 148 C 190 142 220 155 225 240 Z" fill="#F5EFEB" />
      {/* Ribbed Cardigan folds and textures */}
      <path d="M 152 153 Q 140 185 138 220" stroke="#E5DDD7" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 175 152 Q 185 185 190 225" stroke="#E5DDD7" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 198 158 Q 210 190 215 228" stroke="#E5DDD7" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Girl's head and neck, tilted forward */}
      {/* Neck */}
      <path d="M 166 122 L 163 145" stroke="#7A6855" strokeWidth="1.2" />
      <rect x="162" y="125" width="10" height="15" rx="3" fill="#F6E3D4" />
      {/* Face profile angled down */}
      <ellipse cx="168" cy="112" rx="14" ry="17" fill="#F6E3D4" transform="rotate(22 168 112)" />
      {/* Blush cheeks */}
      <ellipse cx="174" cy="116" rx="4" ry="3" fill="#E89F95" opacity="0.6" transform="rotate(22 174 116)" />
      {/* Eyelash (closed eye looking down) */}
      <path d="M 172 110 Q 174 113 177 111" stroke="#4F3D30" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Soft smiling lip */}
      <path d="M 176 122 Q 177 124 175 125" stroke="#C86A5E" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Loose, long brown hair with messy low bun */}
      {/* Messy Low Bun */}
      <circle cx="145" cy="100" r="11" fill="#4F3D30" />
      <circle cx="143" cy="98" r="9" fill="#634D3E" />
      {/* Hair covering head */}
      <path d="M 148 102 C 145 120 162 132 170 125 C 178 118 178 100 172 95 C 164 90 152 94 148 102 Z" fill="#4F3D30" />
      {/* Hair strands and highlights */}
      <path d="M 152 100 Q 165 106 172 118" stroke="#634D3E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 150 106 Q 160 114 167 125" stroke="#4F3D30" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Messy strands hanging down */}
      <path d="M 166 123 Q 164 135 160 142" stroke="#4F3D30" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 171 120 Q 172 130 170 136" stroke="#4F3D30" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Ribbed Cardigan Sleeves (Arms writing) */}
      {/* Left arm resting */}
      <path d="M 148 185 Q 146 205 152 218" stroke="#F5EFEB" strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M 148 185 Q 146 205 152 218" stroke="#E5DDD7" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Hand left */}
      <circle cx="153" cy="222" r="6" fill="#F6E3D4" />

      {/* Right arm writing */}
      <path d="M 195 180 Q 190 205 174 218" stroke="#F5EFEB" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M 195 180 Q 190 205 174 218" stroke="#E5DDD7" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Hand right */}
      <circle cx="173" cy="221" r="6.5" fill="#F6E3D4" />
      {/* Pen (Blue ballpoint pen) */}
      <path d="M 173 221 L 166 215" stroke="#2E557F" strokeWidth="2" strokeLinecap="round" />
      <path d="M 173 221 L 175 225" stroke="#3A2F28" strokeWidth="1.5" strokeLinecap="round" />

      {/* THE OPEN JOURNAL/PLANNER */}
      {/* Journal Cover lying flat */}
      <path d="M 125 218 L 185 210 L 205 235 L 140 245 Z" fill="#A78B71" stroke="#7A6553" strokeWidth="1" />
      {/* Left page */}
      <path d="M 128 219 L 161 214 L 162 238 L 141 243 Z" fill="#FCFAF7" />
      {/* Right page */}
      <path d="M 163 214 L 183 211 L 202 232 L 164 238 Z" fill="#FCFAF7" stroke="#E5DDD7" strokeWidth="0.8" />
      {/* Center seam ring binder stitches */}
      <path d="M 162 214 Q 163 216 162 218" stroke="#7A6553" strokeWidth="1" fill="none" />
      <path d="M 162 222 Q 163 224 162 226" stroke="#7A6553" strokeWidth="1" fill="none" />
      <path d="M 162 230 Q 163 232 162 234" stroke="#7A6553" strokeWidth="1" fill="none" />
      {/* Mini handwriting lines on page */}
      <path d="M 134 225 L 154 222 M 135 230 L 155 227 M 136 235 L 150 233" stroke="#8A7B6E" strokeWidth="0.8" opacity="0.75" />
      <path d="M 168 221 L 178 219 M 168 226 L 184 224 M 170 231 L 190 228" stroke="#8A7B6E" strokeWidth="0.8" opacity="0.75" />
    </svg>
  );
};

export const OnboardingBooks: React.FC = () => {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background ambient glow */}
      <circle cx="140" cy="140" r="115" fill="#FDFBF9" opacity="0.9" />
      <circle cx="140" cy="140" r="100" fill="#FBF6EE" opacity="0.65" />
      
      {/* Wooden table surface */}
      <path d="M 15 240 L 265 240" stroke="#A78B71" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 25 244 L 255 244" stroke="#C6B5A2" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* BOOKS STACK (LEFT-CENTERED) */}
      {/* Bottom Book 1 (Mocha Brown/Clay Red) */}
      {/* Shadow */}
      <ellipse cx="100" cy="240" rx="42" ry="5" fill="#604E40" opacity="0.14" />
      {/* Red/Brown Cover */}
      <rect x="58" y="215" width="82" height="25" rx="3" fill="#9C6B5E" stroke="#76483C" strokeWidth="1.2" />
      {/* Pages block */}
      <rect x="62" y="218" width="75" height="19" fill="#FAF6EE" stroke="#E3DEC5" strokeWidth="0.8" />
      {/* Pages lines details */}
      <line x1="64" y1="223" x2="135" y2="223" stroke="#D3CDB5" strokeWidth="0.6" />
      <line x1="64" y1="227" x2="135" y2="227" stroke="#D3CDB5" strokeWidth="0.6" />
      <line x1="64" y1="231" x2="135" y2="231" stroke="#D3CDB5" strokeWidth="0.6" />
      {/* Spine bands & title decoration */}
      <path d="M 58 215 V 240" stroke="#76483C" strokeWidth="3" />
      <path d="M 64 215 V 240" stroke="#B88A7D" strokeWidth="1.5" />
      <text x="75" y="229" fill="#FAF6EE" fontFamily="serif" fontSize="7.5" fontWeight="bold" letterSpacing="0.8">SEASONS</text>

      {/* Middle Book 2 (Dusty Sage Green) */}
      {/* Sage Green Cover */}
      <rect x="65" y="190" width="76" height="25" rx="3" fill="#8FA489" stroke="#6D8167" strokeWidth="1.2" />
      {/* Pages block */}
      <rect x="69" y="193" width="69" height="19" fill="#FAF6EE" stroke="#E3DEC5" strokeWidth="0.8" />
      <line x1="71" y1="198" x2="135" y2="198" stroke="#D3CDB5" strokeWidth="0.6" />
      <line x1="71" y1="202" x2="135" y2="202" stroke="#D3CDB5" strokeWidth="0.6" />
      <line x1="71" y1="206" x2="135" y2="206" stroke="#D3CDB5" strokeWidth="0.6" />
      {/* Spine bands & title */}
      <path d="M 65 190 V 215" stroke="#6D8167" strokeWidth="3" />
      <path d="M 71 190 V 215" stroke="#ACC4A5" strokeWidth="1.5" />
      <text x="80" y="204" fill="#FAF6EE" fontFamily="serif" fontSize="7.5" fontWeight="bold" letterSpacing="0.8">BOTANY</text>

      {/* Top Book 3 (Soft Terracotta Red / Dusty Coral) */}
      {/* Spine facing slightly skewed for organic feel */}
      <g transform="rotate(-1.5 100 178)">
        <rect x="62" y="166" width="79" height="24" rx="3" fill="#C58D84" stroke="#9E675E" strokeWidth="1.2" />
        {/* Pages block */}
        <rect x="66" y="169" width="72" height="18" fill="#FAF6EE" stroke="#E3DEC5" strokeWidth="0.8" />
        <line x1="68" y1="174" x2="135" y2="174" stroke="#D3CDB5" strokeWidth="0.6" />
        <line x1="68" y1="178" x2="135" y2="178" stroke="#D3CDB5" strokeWidth="0.6" />
        {/* Spine bands */}
        <path d="M 62 166 V 190" stroke="#9E675E" strokeWidth="3" />
        <path d="M 68 166 V 190" stroke="#E2ABA2" strokeWidth="1.5" />
        <text x="75" y="179" fill="#FAF6EE" fontFamily="serif" fontSize="7" fontWeight="bold" letterSpacing="0.5">STORIES</text>
      </g>

      {/* Topmost Book 4 (Warm Cream / Soft Gold Spine) */}
      <g transform="rotate(2 100 152)">
        <rect x="68" y="146" width="68" height="20" rx="2" fill="#E4D5C5" stroke="#9E8B75" strokeWidth="1" />
        {/* Pages block */}
        <rect x="72" y="149" width="61" height="14" fill="#FAF6EE" stroke="#E3DEC5" strokeWidth="0.8" />
        {/* Spine bands */}
        <path d="M 68 146 V 166" stroke="#9E8B75" strokeWidth="2.5" />
        <text x="78" y="157" fill="#5A4738" fontFamily="serif" fontSize="6.5" fontWeight="bold" letterSpacing="0.5">AUTUMN TALES</text>
      </g>

      {/* Book Ribbon/Bookmark hanging from Top Book */}
      <path d="M 115 166 C 118 185 112 195 116 205" stroke="#C86A5E" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* CLEAR GLASS BOTTLE VASE WITH WILDFLOWERS (RIGHT) */}
      {/* Vase Shadow */}
      <ellipse cx="185" cy="241" rx="18" ry="4.5" fill="#604E40" opacity="0.12" />
      {/* Stems inside bottle */}
      <path d="M 185 240 L 183 175" stroke="#5C6E52" strokeWidth="1.2" />
      <path d="M 180 240 L 174 185" stroke="#526449" strokeWidth="1" />
      <path d="M 188 238 L 195 180" stroke="#6F8565" strokeWidth="1" />
      
      {/* Transparent glass bottle body */}
      <path
        d="M 172 240 C 166 240 163 234 165 212 C 167 188 175 182 178 180 L 178 174 C 178 171 180 170 185 170 C 190 170 192 171 192 174 L 192 180 C 195 182 203 188 205 212 C 207 234 204 240 198 240 Z"
        fill="#EDF5F7"
        opacity="0.65"
        stroke="#8EA2B4"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Water line */}
      <path d="M 166 215 Q 185 218 204 215" stroke="#8EA2B4" strokeWidth="1" />
      {/* Glare/reflection highlights on glass */}
      <path d="M 170 200 Q 168 215 171 228" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      <path d="M 191 173 L 191 179" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

      {/* Wildflower Bouquet growing high */}
      {/* Stem 1 (Tall center wheat/grass stalk) */}
      <path d="M 183 170 Q 185 130 188 85" stroke="#5C6E52" strokeWidth="1.5" fill="none" />
      <path d="M 188 85 L 186 65 M 188 85 L 192 68 M 188 85 L 184 72 M 188 85 L 194 75" stroke="#CBB191" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="186" cy="65" r="1.5" fill="#CBB191" />
      <circle cx="192" cy="68" r="1.5" fill="#CBB191" />
      <circle cx="184" cy="72" r="1.5" fill="#CBB191" />
      <circle cx="194" cy="75" r="1.5" fill="#CBB191" />

      {/* Stem 2 (Eucalyptus Branch Left) */}
      <path d="M 180 170 Q 165 140 155 105" stroke="#5C6E52" strokeWidth="1.2" fill="none" />
      {/* Eucalyptus Leaves */}
      <ellipse cx="152" cy="115" rx="7.5" ry="6.5" fill="#7FA096" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(15 152 115)" />
      <ellipse cx="158" cy="130" rx="8" ry="7" fill="#8BAAA0" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(-10 158 130)" />
      <ellipse cx="166" cy="148" rx="8" ry="7" fill="#7FA096" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(25 166 148)" />
      <ellipse cx="148" cy="100" rx="6" ry="5" fill="#6F8F85" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(5 148 100)" />

      {/* Stem 3 (Eucalyptus Branch Right) */}
      <path d="M 186 170 Q 200 135 212 110" stroke="#5C6E52" strokeWidth="1.2" fill="none" />
      <ellipse cx="204" cy="140" rx="7" ry="6" fill="#7FA096" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(-15 204 140)" />
      <ellipse cx="211" cy="122" rx="7.5" ry="6.5" fill="#8BAAA0" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(20 211 122)" />
      <ellipse cx="214" cy="106" rx="5.5" ry="4.5" fill="#6F8F85" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(-5 214 106)" />

      {/* Stem 4 (Lavender Sprig - Center Left) */}
      <path d="M 182 170 Q 174 125 172 90" stroke="#5C6E52" strokeWidth="1" fill="none" />
      {/* Lavender purple flower buds */}
      <circle cx="172" cy="90" r="2.5" fill="#9381A5" />
      <circle cx="170" cy="84" r="2.5" fill="#9F8DB0" />
      <circle cx="174" cy="85" r="2" fill="#9381A5" />
      <circle cx="172" cy="78" r="2.5" fill="#B19FBF" />
      <circle cx="169" cy="74" r="2" fill="#9381A5" />
      <circle cx="173" cy="73" r="2.5" fill="#9F8DB0" />
      <circle cx="171" cy="67" r="2" fill="#B19FBF" />

      {/* Stem 5 (Daisy Wildflower - Center Right) */}
      <path d="M 185 170 Q 192 135 195 105" stroke="#5C6E52" strokeWidth="1.2" fill="none" />
      {/* White Daisy */}
      <g transform="translate(195, 105)">
        <circle cx="0" cy="0" r="10" fill="#FAF5EF" opacity="0.3" />
        <ellipse cx="0" cy="0" rx="2.5" ry="2.5" fill="#F4D03F" stroke="#D4AC0D" strokeWidth="0.8" />
        {/* Daisy Petals */}
        <ellipse cx="0" cy="-6" rx="1.8" ry="4.5" fill="#FCFAF7" stroke="#E5DDD7" strokeWidth="0.5" />
        <ellipse cx="0" cy="6" rx="1.8" ry="4.5" fill="#FCFAF7" stroke="#E5DDD7" strokeWidth="0.5" />
        <ellipse cx="-6" cy="0" rx="4.5" ry="1.8" fill="#FCFAF7" stroke="#E5DDD7" strokeWidth="0.5" />
        <ellipse cx="6" cy="0" rx="4.5" ry="1.8" fill="#FCFAF7" stroke="#E5DDD7" strokeWidth="0.5" />
        <ellipse cx="-4" cy="-4" rx="3.5" ry="1.8" fill="#FCFAF7" stroke="#E5DDD7" strokeWidth="0.5" transform="rotate(45 -4 -4)" />
        <ellipse cx="4" cy="4" rx="3.5" ry="1.8" fill="#FCFAF7" stroke="#E5DDD7" strokeWidth="0.5" transform="rotate(45 4 4)" />
        <ellipse cx="4" cy="-4" rx="1.8" ry="3.5" fill="#FCFAF7" stroke="#E5DDD7" strokeWidth="0.5" transform="rotate(45 4 -4)" />
        <ellipse cx="-4" cy="4" rx="1.8" ry="3.5" fill="#FCFAF7" stroke="#E5DDD7" strokeWidth="0.5" transform="rotate(45 -4 4)" />
      </g>
    </svg>
  );
};

export const OnboardingGrowth: React.FC = () => {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background ambient glow */}
      <circle cx="140" cy="140" r="115" fill="#FDFBF9" opacity="0.9" />
      <circle cx="140" cy="140" r="100" fill="#FBF6EE" opacity="0.65" />
      
      {/* Wooden desk surface */}
      <path d="M 15 240 L 265 240" stroke="#A78B71" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 25 244 L 255 244" stroke="#C6B5A2" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* LEATHER JOURNAL (LEFT) */}
      {/* Shadow */}
      <rect x="42" y="112" width="76" height="122" rx="8" fill="#604E40" opacity="0.14" />
      {/* Leather Cover (Rich Chestnut/Brown) */}
      <rect x="38" y="108" width="76" height="122" rx="8" fill="#845439" stroke="#633923" strokeWidth="1.8" />
      {/* Gold embossed edge trim or pattern */}
      <rect x="42" y="112" width="68" height="114" rx="5" fill="none" stroke="#D4A373" strokeWidth="0.6" opacity="0.4" />
      {/* Binder stitches on spine (left edge) */}
      <path d="M 38 120 L 41 123 M 38 135 L 41 138 M 38 150 L 41 153 M 38 165 L 41 168 M 38 180 L 41 183 M 38 195 L 41 198 M 38 210 L 41 213" stroke="#FAF6EE" strokeWidth="1.2" opacity="0.7" />
      {/* Horizontal leather wrapping strap around middle */}
      <rect x="36" y="158" width="80" height="16" fill="#5A321E" stroke="#462514" strokeWidth="1" />
      {/* Antique metal lock buckle in brass/gold */}
      <rect x="90" y="154" width="14" height="24" rx="2.5" fill="#D4A373" stroke="#8A6341" strokeWidth="1.2" />
      <circle cx="97" cy="166" r="2.5" fill="#5A321E" />
      
      {/* GLASS FLOWER VASE (CENTER) */}
      {/* Vase Shadow */}
      <ellipse cx="152" cy="241" rx="18" ry="4.5" fill="#604E40" opacity="0.12" />
      {/* Stems inside bottle */}
      <path d="M 152 240 L 150 165" stroke="#5C6E52" strokeWidth="1.2" />
      <path d="M 148 240 L 142 175" stroke="#526449" strokeWidth="1.2" />
      <path d="M 156 238 L 160 170" stroke="#6F8565" strokeWidth="1" />
      {/* Narrow glass jar vase */}
      <path
        d="M 140 240 C 135 240 132 234 134 195 C 136 155 144 148 147 146 L 147 141 C 147 139 149 138 152 138 C 155 138 157 139 157 141 L 157 146 C 160 148 168 155 170 195 C 172 234 169 240 164 240 Z"
        fill="#EDF5F7"
        opacity="0.65"
        stroke="#8EA2B4"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Water line */}
      <path d="M 135 200 Q 152 203 169 200" stroke="#8EA2B4" strokeWidth="1" />
      {/* Glare reflections */}
      <path d="M 139 185 Q 137 205 140 222" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />

      {/* Lush dry bouquet inside center vase */}
      {/* Tall Golden Wheat stalk */}
      <path d="M 152 138 Q 150 100 152 55" stroke="#5C6E52" strokeWidth="1.2" fill="none" />
      <path d="M 152 55 L 149 40 M 152 55 L 156 42 M 152 55 L 148 48 M 152 55 L 157 50" stroke="#CBB191" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="149" cy="40" r="1.5" fill="#CBB191" />
      <circle cx="156" cy="42" r="1.5" fill="#CBB191" />

      {/* Eucalyptus stalk left */}
      <path d="M 148 138 Q 132 110 125 80" stroke="#5C6E52" strokeWidth="1" fill="none" />
      <ellipse cx="122" cy="90" rx="7" ry="6" fill="#7FA096" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(15 122 90)" />
      <ellipse cx="131" cy="105" rx="7.5" ry="6.5" fill="#8BAAA0" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(-10 131 105)" />

      {/* Pink Rosebud (Center Right) */}
      <path d="M 155 138 Q 165 115 168 92" stroke="#5C6E52" strokeWidth="1.2" fill="none" />
      {/* Watercolor soft pink rose bud */}
      <g transform="translate(168, 92)">
        <circle cx="0" cy="0" r="7.5" fill="#D29B9B" stroke="#B27878" strokeWidth="1" />
        <path d="M -4 -3 Q 0 -6 3 -4 Q 5 0 2 3 Q -2 5 -5 1 Q -6 -1 -4 -3" fill="#B27878" opacity="0.6" />
        <ellipse cx="-1" cy="-2" rx="3" ry="2.2" fill="#E2B1B1" />
      </g>
      <ellipse cx="163" cy="102" rx="4.5" ry="5.5" fill="#8BAAA0" stroke="#5C7A70" strokeWidth="0.8" transform="rotate(-25 163 102)" />

      {/* Lavender stalk high */}
      <path d="M 150 138 Q 146 100 142 68" stroke="#5C6E52" strokeWidth="1" fill="none" />
      <circle cx="142" cy="68" r="2.5" fill="#9381A5" />
      <circle cx="140" cy="62" r="2.5" fill="#9F8DB0" />
      <circle cx="144" cy="63" r="2" fill="#9381A5" />
      <circle cx="141" cy="56" r="2.5" fill="#B19FBF" />
      <circle cx="139" cy="51" r="2" fill="#9381A5" />
      <circle cx="143" cy="50" r="2.5" fill="#9F8DB0" />

      {/* COFFEE MUG ON FRINGED NAPKIN COASTER (RIGHT) */}
      {/* Woven Linen Napkin Coaster with fringed edges */}
      <ellipse cx="218" cy="241" rx="24" ry="5.5" fill="#604E40" opacity="0.12" />
      <path d="M 188 228 L 244 220 L 252 238 L 194 246 Z" fill="#EFECE6" stroke="#C6B5A2" strokeWidth="1" />
      {/* Fringe lines */}
      <path d="M 188 228 L 184 233 M 190 231 L 186 236 M 192 234 L 188 239 M 194 237 L 190 242" stroke="#A78B71" strokeWidth="1" />
      <path d="M 244 220 L 248 225 M 246 223 L 250 228 M 248 226 L 252 231 M 250 229 L 254 234" stroke="#A78B71" strokeWidth="1" />

      {/* Mug Body (Warm Latte / Ceramic Speckled White) */}
      <path d="M 200 200 C 200 185 204 175 220 175 C 236 175 240 185 240 200 C 240 215 235 238 220 238 C 205 238 200 215 200 200 Z" fill="#F4EFEB" stroke="#8B7355" strokeWidth="1.5" />
      {/* Mug Handle */}
      <path d="M 239 191 C 247 191 251 195 251 201 C 251 207 247 211 239 211" stroke="#F4EFEB" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 239 191 C 247 191 251 195 251 201 C 251 207 247 211 239 211" stroke="#8B7355" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Coffee liquid surface */}
      <ellipse cx="220" cy="180" rx="16" ry="5.5" fill="#754C33" stroke="#5A3A25" strokeWidth="1" />
      {/* Coffee steam lines */}
      <path d="M 214 168 Q 212 160 216 154" stroke="#D4A373" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M 224 170 Q 222 162 226 156" stroke="#D4A373" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Golden Spoon lying next to cup on napkin */}
      <path d="M 193 234 L 180 222" stroke="#CBB191" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="180" cy="222" rx="4.5" ry="3" fill="#CBB191" transform="rotate(-30 180 222)" />
      <path d="M 193 234 L 180 222" stroke="#9E8B75" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
};

export const OtpEnvelope: React.FC = () => {
  return (
    <svg
      className="w-56 h-56 mx-auto filter drop-shadow-md"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="110" r="75" fill="#F5EBE0" opacity="0.4" />

      {/* Soft florals growing from the envelope */}
      <path d="M100 100C110 80 120 60 130 50" stroke="#8CA489" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M90 100C80 82 72 70 60 62" stroke="#A4B494" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M105 100C102 75 95 55 92 40" stroke="#8CA489" strokeWidth="1" strokeLinecap="round" />

      {/* Blossoms */}
      <circle cx="130" cy="50" r="6" fill="#D4A373" />
      <circle cx="130" cy="50" r="2.5" fill="#FFFFFF" />
      <circle cx="60" cy="62" r="5" fill="#E6CCB2" />
      <circle cx="92" cy="40" r="7" fill="#C9B79C" />
      <circle cx="92" cy="40" r="3" fill="#FFFFFF" />

      <path d="M118 70C122 68 123 64 120 64C117 64 116 68 118 70Z" fill="#A4B494" />
      <path d="M80 82C76 80 75 76 78 76C81 76 82 80 80 82Z" fill="#8CA489" />

      {/* Open Envelope */}
      {/* Back flap of open envelope */}
      <path d="M40 105V155C40 159.4 43.6 163 48 163H152C156.4 163 160 159.4 160 155V105" fill="#FAF5EF" stroke="#C9B79C" strokeWidth="1.5" />
      
      {/* Letter paper coming out */}
      <rect x="52" y="85" width="96" height="60" rx="3" fill="#FFFFFF" stroke="#E6CCB2" strokeWidth="1" />
      <line x1="62" y1="98" x2="138" y2="98" stroke="#F5EBE0" strokeWidth="2" />
      <line x1="62" y1="108" x2="138" y2="108" stroke="#F5EBE0" strokeWidth="2" />
      <line x1="62" y1="118" x2="118" y2="118" stroke="#F5EBE0" strokeWidth="2" />

      {/* Left/Right folding flaps of envelope */}
      <path d="M40 105L100 135L160 105" fill="#FAF5EF" opacity="0.3" />
      <path d="M40 105L100 135L160 105" stroke="#C9B79C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Bottom triangle flap (overlapping) */}
      <path d="M40 163L100 130L160 163" fill="#F5EBE0" />
      <path d="M40 163L100 130L160 163" stroke="#C9B79C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Little heart stamp sealing the letter or concept */}
      <path
        d="M100 132C100 132 97 129 95 129C93 129 91.5 130.5 91.5 132.5C91.5 135 100 139 100 139C100 139 108.5 135 108.5 132.5C108.5 130.5 107 129 105 129C103 129 100 132 100 132Z"
        fill="#D4A373"
      />
    </svg>
  );
};

export const VaseFlowers: React.FC = () => {
  return (
    <svg
      className="w-56 h-56 mx-auto filter drop-shadow-md"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="110" r="75" fill="#F5EBE0" opacity="0.5" />

      {/* Ceramic Mug Cup holding flowers */}
      {/* Mug Handle */}
      <path d="M136 118C145 118 149 123 149 128C149 133 145 138 136 138" stroke="#8DA4C4" strokeWidth="4.5" fill="none" />
      
      {/* Mug Body (beautiful blue ceramic cup with a tiny white heart) */}
      <path d="M68 110C68 104.5 72.5 100 78 100H122C127.5 100 132 104.5 132 110V140C132 147.7 125.7 154 118 154H82C74.3 154 68 147.7 68 140V110Z" fill="#8DA4C4" />
      <ellipse cx="100" cy="100" rx="32" ry="5" fill="#5C7A92" />
      
      {/* White Hand-drawn heart on mug */}
      <path
        d="M100 128C100 128 97.5 125 95.5 125C93.5 125 92 126.5 92 128.5C92 131 100 135 100 135C100 135 108 131 108 128.5C108 126.5 106.5 125 104.5 125C102.5 125 100 128 100 128Z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Soft Wildflowers blossoming out of the mug */}
      {/* Stems */}
      <path d="M92 100C90 75 80 55 75 42" stroke="#8CA489" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M108 100C110 78 118 60 125 48" stroke="#A4B494" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M100 100C100 70 98 50 98 35" stroke="#8CA489" strokeWidth="2" strokeLinecap="round" />

      {/* Flower Buds */}
      <circle cx="75" cy="42" r="7" fill="#D4A373" />
      <circle cx="75" cy="42" r="3" fill="#FFFFFF" />

      <circle cx="125" cy="48" r="6" fill="#E6CCB2" />
      
      {/* Large beautiful daisy-like flower in center */}
      <circle cx="98" cy="35" r="10" fill="#C9B79C" opacity="0.3" />
      <circle cx="98" cy="35" r="5" fill="#C9B79C" />
      <circle cx="88" cy="30" r="4.5" fill="#FAF5EF" />
      <circle cx="108" cy="40" r="4.5" fill="#FAF5EF" />
      <circle cx="106" cy="28" r="4.5" fill="#FAF5EF" />
      <circle cx="90" cy="42" r="4.5" fill="#FAF5EF" />
      <circle cx="98" cy="24" r="4.5" fill="#FAF5EF" />
      <circle cx="98" cy="46" r="4.5" fill="#FAF5EF" />
      <circle cx="108" cy="33" r="4.5" fill="#FAF5EF" />
      <circle cx="88" cy="37" r="4.5" fill="#FAF5EF" />

      {/* Soft leaves */}
      <path d="M85 75C80 73 78 69 81 69C84 69 86 73 85 75Z" fill="#A4B494" />
      <path d="M112 70C116 68 118 64 114 64C110 64 110 68 112 70Z" fill="#8CA489" />
    </svg>
  );
};
