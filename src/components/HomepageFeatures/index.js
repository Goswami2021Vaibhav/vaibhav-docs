import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Interview Prep',
    to: '/interview/intro',
    description: (
      <>
        JavaScript, TypeScript, React, and Next.js — question banks organized
        topic by topic, trimmed to what's actually worth knowing.
      </>
    ),
  },
  {
    title: 'Knowledge Base',
    to: '/docs/intro',
    description: (
      <>
        Git commands, deployment runbooks, and the steps I don't want to
        re-Google every time.
      </>
    ),
  },
  {
    title: 'Always Growing',
    to: null,
    description: (
      <>
        New subjects and notes get added as I learn them. This is a living
        reference, not a finished one.
      </>
    ),
  },
];

function Feature({title, to, description}) {
  const heading = <Heading as="h3">{title}</Heading>;
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        {to ? <Link to={to}>{heading}</Link> : heading}
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
