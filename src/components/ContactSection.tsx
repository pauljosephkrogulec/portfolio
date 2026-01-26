import { motion } from "framer-motion";
import { Github, Twitter, Mail } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/pauljosephkrogulec" },
  { icon: Twitter, label: "Twitter", href: "http://x.com/Paul_josephK" },
  { icon: Mail, label: "Email", href: "mailto:krogulec.work@gmail.com" },
];

const ContactSection = () => {
  return (
    <section id="contact" className="relative min-h-[60vh] bg-background px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-accent">
            Contactez-moi
          </p>
          <h2 className="font-display text-4xl font-light md:text-5xl lg:text-6xl">
            Entrons en <span className="text-gradient-moon">Contact</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-body text-muted-foreground">
            Je suis toujours ravi de rencontrer d'autres développeurs et d'apprendre de la communauté.
            N'hésitez pas à me contacter !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center gap-6"
        >
          {socials.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="glass-card group flex h-16 w-16 items-center justify-center transition-all duration-300 hover:glow-moon"
            >
              <social.icon className="h-6 w-6 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
            </motion.a>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 font-body text-xs uppercase tracking-widest text-muted-foreground"
        >
          Créé avec passion & curiosité
        </motion.p>
      </div>
    </section>
  );
};

export default ContactSection;
