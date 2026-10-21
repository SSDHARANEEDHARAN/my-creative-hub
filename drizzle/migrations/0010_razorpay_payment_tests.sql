CREATE TABLE public.razorpay_payment_tests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 exploration_id uuid NOT NULL REFERENCES public.explorations(id) ON DELETE CASCADE,
 order_id text NOT NULL UNIQUE,
 payment_id text UNIQUE,
 amount_paise integer NOT NULL DEFAULT 500 CHECK (amount_paise = 500),
 currency text NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
 status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','paid')),
 created_at timestamptz NOT NULL DEFAULT now(),
 paid_at timestamptz
);
GRANT SELECT ON public.razorpay_payment_tests TO authenticated;
GRANT ALL ON public.razorpay_payment_tests TO service_role;
ALTER TABLE public.razorpay_payment_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own payment tests" ON public.razorpay_payment_tests FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX razorpay_payment_tests_user_created ON public.razorpay_payment_tests(user_id, created_at);
COMMENT ON TABLE public.razorpay_payment_tests IS 'Separate INR 5 checkout tests; never grants bot purchase or file entitlement.';