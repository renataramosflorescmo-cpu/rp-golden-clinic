import { motion } from "framer-motion";
import clinicImg from "@/assets/clinic-interior.jpg";

const AboutSection = () => {
  return (
    <section id="sobre" className="section-padding bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Sobre</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              Dra Roberta Castro
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Médica CRM 160891, Especialista em Dermatologia em São Paulo, especializada em cuidados com a pele, tratamentos estéticos e dermatológicos, promovendo saúde e beleza com abordagens modernas e personalizadas.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Formada pela Faculdade de Medicina de Maringá (2013). Pós-graduação em Dermatologia Clínica e Cirúrgica pelo Instituto Pele Saudável em São Paulo e Dermatologia Estética Avançada e Cosmetologia pela ISMD.
            </p>
            <p className="font-body text-foreground/80 italic leading-relaxed mb-8">
              "Sou médica, cristã, mãe do Marcos. Apaixonada pela Dermatologia e empenhada na arte de ajudar as pessoas a recuperar a autoestima."
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { num: "10+", label: "Anos de Experiência" },
                { num: "5.000+", label: "Clientes Felizes" },
                { num: "6+", label: "Especializações" },
                { num: "98%", label: "Avaliações Positivas" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-3xl font-bold text-primary">{s.num}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src={clinicImg}
              alt="Clínica Dra Roberta Castro"
              width={800}
              height={800}
              loading="lazy"
              className="rounded-3xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-rose-gradient text-primary-foreground rounded-2xl p-6 shadow-xl">
              <p className="font-display text-3xl font-bold">CRM</p>
              <p className="font-body text-sm">160891</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
