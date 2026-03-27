import { motion } from "framer-motion";
import beautyImg from "@/assets/beauty-profile.png";

const AboutSection = () => {
  return (
    <section id="sobre" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Sobre</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
              Dra Roberta Castro
            </h2>
            <div className="w-12 h-px bg-accent mb-8" />

            <p className="font-body text-muted-foreground leading-relaxed mb-4 font-light">
              Proprietária e fundadora da RP Golden Clinic. Médica CRM 160891, Especialista em Dermatologia em São Paulo, especializada em cuidados com a pele, tratamentos estéticos e dermatológicos, promovendo saúde e beleza com abordagens modernas e personalizadas.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-4 font-light">
              Formada pela Faculdade de Medicina de Maringá (2013). Pós-graduação em Dermatologia Clínica e Cirúrgica pelo Instituto Pele Saudável e Estética Avançada pela ISMD.
            </p>
            <blockquote className="border-l-2 border-accent pl-5 my-8">
              <p className="font-display text-lg italic text-foreground/80 leading-relaxed">
                "Apaixonada pela Dermatologia e empenhada na arte de ajudar as pessoas a recuperar a autoestima."
              </p>
            </blockquote>

            <div className="grid grid-cols-4 gap-6 mt-8">
              {[
                { num: "10+", label: "Anos" },
                { num: "5.000+", label: "Pacientes" },
                { num: "6+", label: "Especialidades" },
                { num: "98%", label: "Aprovação" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-primary">{s.num}</p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex flex-col items-center justify-end"
          >
            <img
              src={beautyImg}
              alt="Dra Roberta Castro"
              loading="lazy"
              className="relative z-10 w-auto h-[550px] md:h-[680px] object-contain drop-shadow-lg"
            />
            {/* Label below arms */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute z-20 bottom-[2%] left-1/2 -translate-x-1/2 bg-primary/90 px-10 py-3 rounded-full whitespace-nowrap"
            >
              <p className="font-body text-xs tracking-[0.25em] uppercase text-primary-foreground text-center">
                Fundadora da RP Golden Clinic
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
