import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Support: [
      { label: 'Help Centre', href: '#' },
      { label: 'Cancellation options', href: '#' },
      { label: 'Safety information', href: '#' },
      { label: 'Contact us', href: '#' },
    ],
    Community: [
      { label: 'Airbnb.org disaster relief', href: '#' },
      { label: 'Combating discrimination', href: '#' },
      { label: 'Refer a host', href: '#' },
      { label: 'Community forum', href: '#' },
    ],
    Hosting: [
      { label: 'List your property', href: '#' },
      { label: 'Host resources', href: '#' },
      { label: 'Responsible hosting', href: '#' },
      { label: 'Host insurance', href: '#' },
    ],
    Company: [
      { label: 'About us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  }

  const socialLinks = [
    {
      label: 'Facebook',
      href: '#',
      icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
    },
    {
      label: 'Twitter',
      href: '#',
      icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>,
    },
    {
      label: 'Instagram',
      href: '#',
      icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" /></svg>,
    },
    {
      label: 'YouTube',
      href: '#',
      icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
    },
  ]

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 text-neutral-600" role="contentinfo">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-10 lg:px-20 lg:py-16">
        <div className="grid gap-10 border-b border-neutral-200 pb-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-1.5 text-[22px] font-bold tracking-tight text-[#FF385C]" aria-label="Airbnb home">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z" />
              </svg>
              airbnb
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-600">
              Your comfort, our priority. Discover unforgettable stays across Nigeria and beyond.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <nav className="grid grid-cols-2 gap-8 sm:col-span-1 lg:col-span-4 lg:grid-cols-4" aria-label="Footer navigation">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-4 text-sm font-semibold text-neutral-900">{category}</h3>
                <ul className="space-y-3" role="list">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 pt-8 text-sm text-neutral-600 lg:flex-row lg:items-center lg:justify-between">
          <p>&copy; {currentYear} Airbnb, Inc. · Solace Hotels. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-9c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9m0-18c-2.5 2.4-4 5.6-4 9s1.5 6.6 4 9M3.6 9h16.8M3.6 15h16.8" />
              </svg>
              English (NG)
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-neutral-900">₦ NGN</span>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="#" className="transition-colors hover:text-neutral-900 hover:underline">Privacy</Link>
              <Link to="#" className="transition-colors hover:text-neutral-900 hover:underline">Terms</Link>
              <Link to="#" className="transition-colors hover:text-neutral-900 hover:underline">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
