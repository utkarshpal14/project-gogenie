import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Mail, MapPin, Phone, Send, CircleCheck } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      setTimeout(() => {
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-8 px-4"
    >
      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Contact <span className="text-goginie-primary">GoGinie</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Have questions or feedback? We'd love to hear from you!
          </motion.p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
        {/* Contact Information */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full bg-gradient-to-br from-goginie-primary/20 to-goginie-secondary/10">
            <CardContent className="p-8 flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

              <div className="space-y-6 flex-grow">
                <div className="flex items-start gap-4">
                  <div className="bg-goginie-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-goginie-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-muted-foreground mb-1">For general inquiries:</p>
                    <a href="mailto:hello@goginie.com" className="text-goginie-primary hover:underline">
                      hello@goginie.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-goginie-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-goginie-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Call Us</h3>
                    <p className="text-muted-foreground mb-1">Monday to Friday, 9am-6pm IST</p>
                    <a href="tel:+919876543210" className="text-goginie-primary hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-goginie-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-goginie-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">
                      GoGinie Technologies<br />
                      123 Innovation Street<br />
                      Bengaluru, Karnataka 560001<br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-medium mb-3">Follow Us</h3>
                <div className="flex gap-4">
                  {["Twitter", "LinkedIn", "Instagram", "Facebook"].map((social) => (
                    <Button key={social} variant="outline" size="sm" className="rounded-full">
                      {social}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-goginie-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <CircleCheck className="h-10 w-10 text-goginie-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={formState.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={formState.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      required
                      value={formState.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Write your message here..."
                      rows={6}
                      required
                      value={formState.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Message <Send className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions about GoGinie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "How does GoGinie create travel plans?",
              answer: "GoGinie uses advanced AI algorithms to analyze your preferences, interests, and budget to create personalized travel itineraries tailored specifically to you."
            },
            {
              question: "Is GoGinie free to use?",
              answer: "GoGinie offers both free and premium plans. Basic travel planning is available for free, while advanced features and personalized support are available with our premium plans."
            },
            {
              question: "Can I modify my trip plan after it's generated?",
              answer: "Absolutely! You can edit any aspect of your trip plan, add or remove activities, change accommodations, and adjust your itinerary at any time."
            },
            {
              question: "How far in advance should I plan my trip?",
              answer: "For the best results, we recommend planning at least 3-4 weeks before your trip to ensure availability for accommodations and activities, especially during peak travel seasons."
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <Card className="bg-gradient-to-r from-goginie-primary/20 to-goginie-secondary/10 border-none">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Plan Your Dream Trip?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Let GoGinie's AI craft the perfect travel itinerary for your next adventure
            </p>
            <Button size="lg" asChild>
              <a href="/plan-trip" className="flex items-center gap-2">
                Plan Your Trip Now <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
}
