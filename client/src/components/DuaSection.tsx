import React from "react";

const duas = [
  {
    title: "Before Eating",
    arabic: "بِسۡمِ ٱللَّهِ",
    translation: "In the Name of Allah.",
    transliteration: "Bismillaah.",
    note: "If you forget to say it before starting, then say:",
    reminderArabic: "بِسۡمِ ٱللَّهِ فِى أَوَّلِهِ وَءَاخِرِهِ",
    reminderTranslation: "In the name of Allah, in the beginning and in the end.",
    reminderTransliteration: "Bismillaahifee 'awwalihi wa 'aakhirihi.",
  },
  {
    title: "After Eating",
    arabic: "أَلۡحَمۡدُ لِلَّهِ ٱلَّذِى أَطۡعَمَنِى هَٰذَا وَرَزَقَنِيهِ مِنۡ غَيرِ حَولٍ مِّنِّى وَلَا قُوَّةٍ",
    translation:
      "Praise is to Allah Who has given me this food and sustained me with it though I was unable to do it and powerless.",
    transliteration:
      "Alhamdu lillaahil-lathee 'at'amanee haathaa, wa razaqaneehi, min ghayri hawlin minnee wa laa quwwatin.",
  },
];

const DuaSection: React.FC = () => {
  return (
    <section className="py-16 bg-cream/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Duas <span className="text-gold">for Eating</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Revive the Sunnah with these short yet powerful supplications before and after meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {duas.map((dua, idx) => (
            <div
              key={idx}
              className="bg-white shadow-lg rounded-lg p-6 border border-primary/10"
            >
              <h3 className="text-xl font-semibold text-primary mb-2">{dua.title}</h3>
              <p className="text-2xl text-right font-arabic leading-relaxed mb-4">
                {dua.arabic}
              </p>
              <p className="italic text-gold mb-1">{dua.transliteration}</p>
              <p className="text-gray-700 mb-4">{dua.translation}</p>

              {dua.note && (
                <div className="mt-4 border-t pt-4 border-dashed border-primary/20">
                  <p className="text-sm text-gray-500 mb-2">{dua.note}</p>
                  <p className="text-2xl text-right font-arabic leading-relaxed mb-2">
                    {dua.reminderArabic}
                  </p>
                  <p className="italic text-gold mb-1">{dua.reminderTransliteration}</p>
                  <p className="text-gray-700">{dua.reminderTranslation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DuaSection;
