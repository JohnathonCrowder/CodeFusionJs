import React, { useState } from 'react';
import { 
  FaBrain, FaUsers, FaCode, FaChevronDown, FaChevronUp, 
  FaLightbulb, FaShieldAlt, FaBookOpen, FaLanguage,
  FaToggleOn, FaToggleOff, FaCog, FaRocket, FaInfoCircle,
  FaRandom, FaExclamationTriangle, FaCheckCircle, FaGlobe,
  FaFlask, FaLayerGroup, FaFileAlt, FaBalanceScale, 
  FaArrowRight, FaPalette, FaGraduationCap, FaIndustry,
  FaMarkdown, FaTimes, FaQuestionCircle, FaStar,
  FaTools, FaEye, FaSearch, FaCubes, FaCompass
} from 'react-icons/fa';
import { UpgradeParameters } from '../PromptUpgraderSupport';

interface SmartConfigurationProps {
  upgradeParams: UpgradeParameters;
  onParamsChange: (params: Partial<UpgradeParameters>) => void;
  customInstructions: string;
  onCustomInstructionsChange: (instructions: string) => void;
  darkMode: boolean;
  configurationMode: 'smart' | 'manual';
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

interface TooltipProps {
  content: string;
  title?: string;
  children: React.ReactNode;
  darkMode: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showIcon?: boolean;
  maxWidth?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  title, 
  children, 
  darkMode, 
  position = 'top', 
  size = 'medium',
  showIcon = true,
  maxWidth 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Significantly wider tooltip sizing with custom max-width support
  const sizeClasses = {
    small: maxWidth || 'max-w-sm w-80',
    medium: maxWidth || 'max-w-md w-96', 
    large: maxWidth || 'max-w-lg w-[28rem]',
    xlarge: maxWidth || 'max-w-2xl w-[36rem]'
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-3'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help inline-flex items-center"
        tabIndex={0}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]} animate-fade-in`}>
          <div className={`${sizeClasses[size]} px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-sm
                          ${darkMode
                            ? 'bg-dark-900/95 text-dark-100 border-dark-600 shadow-black/30'
                            : 'bg-white/95 text-gray-800 border-gray-300 shadow-gray-500/30'}`}>
            
            {title && (
              <div className={`font-semibold mb-2 pb-2 border-b flex items-center space-x-2 text-sm
                             ${darkMode ? 'border-dark-600 text-dark-50' : 'border-gray-200 text-gray-900'}`}>
                {showIcon && <FaInfoCircle className="text-blue-500 flex-shrink-0" />}
                <span className="font-bold">{title}</span>
              </div>
            )}
            
            <div className="leading-relaxed whitespace-pre-line text-sm">
              {content}
            </div>
            
            {/* Enhanced arrow with better styling */}
            <div className={`absolute w-0 h-0 border-8
                           ${arrowClasses[position]}
                           ${darkMode ? 'border-dark-900/95' : 'border-white/95'}`} />
          </div>
        </div>
      )}
    </div>
  );
};

const SmartConfiguration: React.FC<SmartConfigurationProps> = ({
  upgradeParams,
  onParamsChange,
  customInstructions,
  onCustomInstructionsChange,
  darkMode,
  configurationMode,
  showAdvanced,
  onToggleAdvanced
}) => {
  const handleParamChange = (key: keyof UpgradeParameters, value: any) => {
    onParamsChange({ [key]: value });
  };

  // Enhanced tooltip content with better formatting and comprehensive explanations
  const tooltipContent = {
    // Primary Settings with detailed explanations
    purpose: {
      title: "Prompt Purpose & Objective",
      content: `Defines the main objective and use case for your prompt upgrade, influencing all enhancement decisions.

🎯 **Code Generation**: Optimizes for creating functional, maintainable code
• Focuses on syntax accuracy and best practices
• Includes error handling and validation
• Emphasizes clear documentation and examples

📊 **Analysis**: Enhances analytical and review capabilities  
• Strengthens logical reasoning and evaluation
• Improves systematic assessment approaches
• Adds multiple perspective analysis

📝 **Documentation**: Improves explanatory and instructional content
• Enhances clarity and comprehension
• Structures information logically
• Includes practical examples and references

🐛 **Debugging**: Focuses on problem-solving and troubleshooting
• Adds systematic diagnostic approaches
• Includes common error scenarios
• Provides step-by-step resolution methods

🎨 **Creative**: Boosts innovative and creative thinking
• Encourages out-of-the-box approaches
• Adds inspiration and ideation techniques
• Supports artistic and innovative processes

⚙️ **General**: Balanced enhancement for versatile use cases
• Applies universal improvement principles
• Maintains flexibility across domains
• Suitable for multi-purpose applications

This setting influences tone, structure, enhancement priorities, and specialized features throughout the upgrade process.`
    },
    
    tone: {
      title: "Communication Tone & Style",
      content: `Sets the personality and communication approach of your upgraded prompt, affecting how users interact with it.

👔 **Professional**: Formal, business-appropriate language
• Uses formal vocabulary and structure
• Maintains objective, authoritative voice
• Suitable for corporate and official contexts
• Emphasizes reliability and credibility

🔧 **Technical**: Precise, detailed technical communication
• Uses domain-specific terminology accurately
• Focuses on precision and technical accuracy
• Includes detailed specifications and requirements
• Appeals to technically-minded users

😊 **Friendly**: Approachable, warm interaction style
• Uses conversational and welcoming language
• Encourages engagement and participation
• Reduces intimidation for new users
• Builds rapport and trust

💬 **Casual**: Relaxed, conversational approach
• Uses informal, everyday language
• Creates comfortable, low-pressure environment
• Suitable for creative and collaborative contexts
• Encourages open dialogue

📢 **Authoritative**: Confident, commanding presence
• Projects expertise and knowledge
• Uses decisive, clear directives
• Suitable for instructional and guidance contexts
• Builds confidence in recommendations

🗣️ **Conversational**: Natural dialogue flow
• Mimics natural human conversation
• Uses questions and interactive elements
• Encourages back-and-forth engagement
• Creates dynamic interaction patterns

The tone affects vocabulary choice, sentence structure, interaction patterns, and overall user experience.`
    },

    target_audience: {
      title: "Target Audience & Skill Level",
      content: `Specifies the intended users and adjusts complexity, terminology, and explanation depth accordingly.

🌱 **Beginner**: Simple explanations, foundational concepts
• Uses basic vocabulary and avoids jargon
• Includes step-by-step instructions
• Provides extensive background context
• Assumes no prior knowledge
• Includes learning resources and references

📈 **Intermediate**: Moderate complexity, some assumptions
• Balances accessibility with technical depth
• Uses some specialized terminology with explanations
• Assumes basic familiarity with concepts
• Provides moderate detail level
• Bridges basic and advanced concepts

🎓 **Expert**: Advanced concepts, technical depth
• Uses specialized terminology freely
• Assumes significant prior knowledge
• Focuses on advanced techniques and nuances
• Emphasizes efficiency and precision
• Addresses complex scenarios and edge cases

🔄 **Mixed**: Adaptable to various skill levels
• Provides layered information (basic to advanced)
• Uses progressive disclosure techniques
• Includes both simple and detailed explanations
• Accommodates diverse user backgrounds
• Offers multiple learning pathways

👨‍🎓 **Students**: Educational focus, learning-oriented
• Emphasizes understanding and comprehension
• Includes educational scaffolding
• Provides learning objectives and outcomes
• Uses pedagogical best practices
• Encourages critical thinking

👨‍💼 **Professionals**: Work-focused, practical applications
• Emphasizes real-world applicability
• Includes business context and implications
• Focuses on efficiency and results
• Addresses professional constraints
• Provides actionable insights

🔬 **Researchers**: Academic rigor, detailed methodology
• Uses scholarly language and references
• Emphasizes methodological soundness
• Includes comprehensive analysis
• Addresses validity and reliability
• Supports evidence-based decision making

This determines vocabulary level, explanation depth, example complexity, and assumed background knowledge.`
    },

    detail_level: {
      title: "Information Detail & Comprehensiveness",
      content: `Controls the amount of information, explanation depth, and comprehensive coverage provided in responses.

📋 **Minimal**: Essential information only
• Focuses on core requirements and key points
• Eliminates unnecessary details and elaboration
• Suitable for quick reference and time-sensitive contexts
• Emphasizes brevity and efficiency
• Provides just enough information to complete tasks

✂️ **Concise**: Key points without excess detail
• Balances completeness with brevity
• Includes important context and background
• Removes redundancy and verbose explanations
• Suitable for experienced users who need focused guidance
• Maintains clarity while reducing length

📄 **Detailed**: Comprehensive coverage of topics
• Provides thorough explanations and context
• Includes multiple examples and scenarios
• Addresses common questions and concerns
• Suitable for learning and reference purposes
• Balances depth with accessibility

📚 **Comprehensive**: Thorough, extensive information
• Covers all relevant aspects and considerations
• Includes edge cases and special circumstances
• Provides multiple approaches and alternatives
• Suitable for complex projects and thorough analysis
• Emphasizes completeness over brevity

🔍 **Exhaustive**: Complete, in-depth exploration
• Leaves no stone unturned in coverage
• Includes all possible scenarios and considerations
• Provides extensive background and context
• Suitable for research and critical applications
• Prioritizes thoroughness over efficiency

Higher detail levels provide more context and comprehensive coverage but may increase prompt length, processing time, and cognitive load for users.`
    },

    complexity_level: {
      title: "Technical Complexity & Sophistication",
      content: `Determines the sophistication of concepts, technical depth, and assumed expertise level in the content.

🟢 **Beginner**: Basic concepts, simple language
• Uses fundamental principles and concepts
• Avoids complex terminology and jargon
• Provides extensive explanations for technical terms
• Includes basic examples and simple scenarios
• Focuses on building foundational understanding
• Uses analogies and familiar comparisons

🟡 **Intermediate**: Moderate technical depth
• Introduces more sophisticated concepts gradually
• Uses some technical terminology with context
• Assumes basic familiarity with domain concepts
• Includes moderately complex examples
• Balances accessibility with technical accuracy
• Bridges basic and advanced understanding

🟠 **Advanced**: Sophisticated concepts and terminology
• Uses specialized vocabulary and technical language
• Assumes significant domain knowledge
• Addresses complex scenarios and interactions
• Includes advanced techniques and methodologies
• Focuses on optimization and refinement
• Addresses nuanced considerations

🔴 **Expert**: Highly technical, specialized knowledge
• Uses cutting-edge concepts and terminology
• Assumes deep expertise and experience
• Addresses highly complex and specialized scenarios
• Includes research-level depth and sophistication
• Focuses on innovation and advanced applications
• Addresses theoretical and experimental approaches

🌈 **Mixed**: Adaptive complexity based on context
• Adjusts complexity to match specific topics
• Provides multiple levels of explanation
• Uses progressive complexity building
• Accommodates diverse expertise levels
• Offers both simple and advanced perspectives

This affects technical terminology usage, concept depth, assumed knowledge level, and the sophistication of examples and scenarios.`
    },

    depth: {
      title: "Analysis Depth & Investigation Level",
      content: `Controls how thoroughly topics are explored, analyzed, and investigated in the enhanced prompt.

🏄 **Surface**: Quick overview, main points only
• Provides high-level summaries and key insights
• Focuses on primary concepts and main ideas
• Suitable for quick understanding and orientation
• Emphasizes breadth over depth
• Covers essential information efficiently

🏊 **Moderate**: Balanced exploration with key details
• Provides reasonable depth on important topics
• Includes supporting details and context
• Balances thoroughness with practicality
• Suitable for most general-purpose applications
• Covers important nuances and considerations

🤿 **Deep**: Thorough investigation and analysis
• Provides comprehensive exploration of topics
• Includes detailed analysis and investigation
• Addresses underlying principles and mechanisms
• Suitable for complex problem-solving
• Uncovers hidden insights and implications

🌊 **Comprehensive**: Complete exploration of all aspects
• Leaves no aspect unexplored or unanalyzed
• Provides exhaustive investigation and coverage
• Addresses all possible angles and perspectives
• Suitable for research and critical applications
• Maximizes insight generation and understanding

Deeper analysis provides more insights, better understanding, and more comprehensive solutions but requires more processing time and may be more complex to follow.`
    },

    // Format & Style Settings with enhanced descriptions
    output_format: {
      title: "Response Structure & Organization Format",
      content: `Defines how information should be organized, structured, and presented to users for optimal comprehension and usability.

📊 **Structured**: Clear sections with headers and organization
• Uses hierarchical organization with clear sections
• Includes headers, subheaders, and logical groupings
• Provides consistent formatting and layout
• Suitable for reference and systematic reading
• Emphasizes clarity and navigability

💬 **Conversational**: Natural dialogue flow
• Mimics natural human conversation patterns
• Uses questions, responses, and interactive elements
• Creates engaging, dynamic interaction
• Suitable for interactive and collaborative contexts
• Emphasizes engagement and participation

• **Bullet Points**: List-based, scannable format
• Uses bullet points and numbered lists extensively
• Emphasizes quick scanning and information retrieval
• Suitable for action items and key points
• Provides easy reference and checklist format
• Emphasizes clarity and accessibility

1️⃣ **Step-by-Step**: Sequential, process-oriented
• Organizes information in logical sequence
• Uses numbered steps and clear progressions
• Suitable for procedures and methodologies
• Emphasizes process flow and logical order
• Provides clear action sequences

📖 **Narrative**: Story-like, flowing prose
• Uses continuous, flowing narrative structure
• Creates cohesive, readable content
• Suitable for explanatory and educational content
• Emphasizes comprehension and engagement
• Provides natural reading experience

❓ **Q&A Format**: Question and answer structure
• Organizes content as questions and responses
• Addresses common queries and concerns
• Suitable for FAQ and reference purposes
• Emphasizes practical problem-solving
• Provides targeted information access

📋 **Outline**: Hierarchical organization
• Uses outline format with main points and sub-points
• Provides clear information hierarchy
• Suitable for planning and organization
• Emphasizes logical structure and relationships
• Supports systematic thinking

💻 **Code Blocks**: Technical, formatted sections
• Uses code blocks and technical formatting
• Emphasizes technical accuracy and precision
• Suitable for programming and technical content
• Provides clear technical examples
• Supports copy-paste functionality

🔄 **Mixed**: Flexible combination of formats
• Adapts format to content requirements
• Uses different formats for different sections
• Provides optimal presentation for each topic
• Emphasizes effectiveness over consistency
• Maximizes comprehension and usability

Format choice significantly affects readability, user comprehension patterns, and task completion efficiency.`
    },

    response_style: {
      title: "Interaction Approach & Engagement Method",
      content: `Determines how the AI should engage with users, present information, and facilitate interaction for optimal user experience.

➡️ **Direct**: Straight to the point, minimal elaboration
• Provides immediate, focused responses
• Eliminates unnecessary explanation and context
• Suitable for experienced users and time-sensitive contexts
• Emphasizes efficiency and speed
• Focuses on essential information only

📝 **Explanatory**: Detailed reasoning and context
• Provides comprehensive explanations and background
• Includes reasoning, methodology, and rationale
• Suitable for learning and understanding contexts
• Emphasizes comprehension and insight
• Supports knowledge building and education

🔄 **Interactive**: Engaging, participatory approach
• Encourages user participation and engagement
• Uses questions, prompts, and interactive elements
• Suitable for collaborative and creative contexts
• Emphasizes dialogue and co-creation
• Supports dynamic, responsive interaction

🎓 **Tutorial**: Teaching-focused, step-by-step guidance
• Provides structured learning experiences
• Uses pedagogical techniques and scaffolding
• Suitable for skill building and education
• Emphasizes learning outcomes and progression
• Supports systematic knowledge development

📚 **Reference**: Quick lookup, comprehensive coverage
• Provides comprehensive, organized information
• Suitable for reference and documentation purposes
• Emphasizes completeness and accessibility
• Supports quick information retrieval
• Focuses on accuracy and comprehensiveness

The interaction style affects user engagement, learning effectiveness, task completion success, and overall user satisfaction.`
    },

    language_style: {
      title: "Vocabulary & Expression Approach",
      content: `Sets the linguistic approach, word choice patterns, and expression style for optimal communication with the target audience.

🗣️ **Natural**: Everyday language, conversational
• Uses common, everyday vocabulary and expressions
• Mimics natural human communication patterns
• Suitable for general audiences and casual contexts
• Emphasizes accessibility and relatability
• Creates comfortable, approachable communication

🔧 **Technical**: Precise terminology, specialized vocabulary
• Uses domain-specific terminology accurately
• Emphasizes precision and technical accuracy
• Suitable for expert audiences and technical contexts
• Focuses on clarity and specificity
• Supports professional and specialized communication

🎓 **Academic**: Formal, scholarly expression
• Uses formal academic language and structure
• Emphasizes objectivity and scholarly rigor
• Suitable for research and educational contexts
• Focuses on evidence-based communication
• Supports analytical and theoretical discussion

💼 **Business**: Professional, corporate communication
• Uses business terminology and conventions
• Emphasizes efficiency and results orientation
• Suitable for corporate and professional contexts
• Focuses on practical applications and outcomes
• Supports decision-making and action-oriented communication

🎨 **Creative**: Expressive, innovative language use
• Uses creative, imaginative language and expressions
• Emphasizes originality and artistic expression
• Suitable for creative and artistic contexts
• Focuses on inspiration and innovation
• Supports creative thinking and expression

Language style significantly impacts audience connection, comprehension effectiveness, and communication success.`
    },

    vocabulary_level: {
      title: "Word Complexity & Terminology Sophistication",
      content: `Controls the sophistication of vocabulary, terminology complexity, and linguistic demands placed on users.

📖 **Simple**: Common words, easy to understand
• Uses basic, widely-understood vocabulary
• Avoids complex or specialized terminology
• Suitable for general audiences and beginners
• Emphasizes accessibility and inclusion
• Minimizes cognitive load and comprehension barriers

📚 **Moderate**: Balanced vocabulary with some technical terms
• Balances accessibility with precision
• Uses some specialized terms with explanations
• Suitable for mixed audiences and intermediate users
• Provides reasonable challenge without overwhelming
• Supports gradual vocabulary development

🎓 **Advanced**: Sophisticated language, complex concepts
• Uses sophisticated vocabulary and terminology
• Assumes significant linguistic competence
• Suitable for educated and expert audiences
• Emphasizes precision and nuanced expression
• Supports complex idea communication

🔬 **Specialized**: Domain-specific terminology and jargon
• Uses highly specialized, technical vocabulary
• Assumes deep domain expertise
• Suitable for expert practitioners and researchers
• Emphasizes technical precision and accuracy
• Supports professional and specialized communication

Vocabulary level should align with your target audience's expertise, educational background, and comfort level with specialized terminology.`
    },

    domain: {
      title: "Subject Area Expertise & Specialization",
      content: `Tailors suggestions, examples, best practices, and specialized knowledge to specific professional fields and domains.

💻 **Software Development**: Programming, coding best practices
• Includes programming languages, frameworks, and tools
• Emphasizes code quality, maintainability, and performance
• Provides software engineering methodologies
• Addresses development lifecycle and practices
• Includes debugging, testing, and deployment considerations

📊 **Data Science**: Analytics, statistics, machine learning
• Includes statistical methods and data analysis techniques
• Emphasizes data quality, visualization, and interpretation
• Provides machine learning and AI methodologies
• Addresses data ethics and privacy considerations
• Includes tools and technologies for data processing

🌐 **Web Development**: Frontend, backend, web technologies
• Includes HTML, CSS, JavaScript, and web frameworks
• Emphasizes user experience and interface design
• Provides web performance and optimization techniques
• Addresses security and accessibility considerations
• Includes modern web development practices

📱 **Mobile Development**: iOS, Android, mobile platforms
• Includes mobile platform-specific considerations
• Emphasizes mobile user experience and performance
• Provides mobile development frameworks and tools
• Addresses platform guidelines and requirements
• Includes mobile-specific challenges and solutions

🔧 **DevOps**: Infrastructure, deployment, automation
• Includes infrastructure management and automation
• Emphasizes deployment pipelines and CI/CD practices
• Provides monitoring and maintenance methodologies
• Addresses scalability and reliability considerations
• Includes cloud platforms and containerization

🤖 **AI/ML**: Artificial intelligence, machine learning
• Includes AI/ML algorithms and methodologies
• Emphasizes model development and training
• Provides data preparation and feature engineering
• Addresses model evaluation and deployment
• Includes ethical AI and bias considerations

🛡️ **Cybersecurity**: Security practices, threat analysis
• Includes security frameworks and methodologies
• Emphasizes threat assessment and risk management
• Provides security tools and technologies
• Addresses compliance and regulatory requirements
• Includes incident response and recovery procedures

Domain selection ensures relevant examples, industry-appropriate guidance, and specialized knowledge application.`
    },

    // Content Enhancement Options with comprehensive descriptions
    include_examples: {
      title: "Practical Examples & Demonstrations",
      content: `Adds concrete, actionable examples to illustrate concepts, demonstrate usage, and provide immediate reference points.

✅ **Benefits of Including Examples**:
• Makes abstract concepts tangible and understandable
• Provides immediate, actionable reference points
• Demonstrates practical application and real-world usage
• Improves user comprehension and retention
• Reduces ambiguity and interpretation errors
• Supports different learning styles and preferences

🎯 **Types of Examples Included**:
• Code snippets and implementation samples
• Step-by-step procedure demonstrations
• Before-and-after comparisons
• Real-world scenario applications
• Common use case illustrations
• Best practice demonstrations

📋 **Example Characteristics**:
• Tailored to your selected domain and complexity level
• Relevant to the specific context and purpose
• Progressive complexity building from simple to advanced
• Include both positive and negative examples
• Demonstrate common pitfalls and how to avoid them
• Provide copy-paste ready code when applicable

🔧 **Implementation Approach**:
• Examples are integrated naturally into explanations
• Multiple examples provided for complex concepts
• Examples include explanatory comments and annotations
• Edge cases and variations are demonstrated
• Examples are tested and verified for accuracy

Including examples significantly improves prompt effectiveness, user understanding, and successful task completion rates.`
    },

    include_constraints: {
      title: "Limitations, Rules & Boundaries",
      content: `Specifies rules, limitations, requirements, and boundaries that must be followed to ensure appropriate and effective results.

🛡️ **Purpose of Constraints**:
• Prevents misuse and inappropriate applications
• Ensures outputs meet specific criteria and standards
• Provides clear boundaries and expectations
• Maintains quality and consistency standards
• Reduces risk of errors and failures
• Guides decision-making within acceptable parameters

📋 **Types of Constraints Included**:
• Technical limitations and requirements
• Performance and resource constraints
• Security and privacy requirements
• Compliance and regulatory considerations
• Quality standards and acceptance criteria
• Scope limitations and boundaries

⚙️ **Constraint Categories**:
• **Input Constraints**: Requirements for input data and parameters
• **Process Constraints**: Rules governing execution and methodology
• **Output Constraints**: Standards for results and deliverables
• **Resource Constraints**: Limitations on time, budget, and resources
• **Environmental Constraints**: Context and situational limitations
• **Ethical Constraints**: Moral and ethical guidelines

🎯 **Implementation Benefits**:
• Prevents common mistakes and errors
• Ensures compliance with standards and regulations
• Provides clear success criteria and boundaries
• Reduces ambiguity and interpretation issues
• Supports quality assurance and validation
• Enables better planning and resource allocation

Constraints help create more reliable, predictable, and appropriate results while preventing common pitfalls and ensuring standards compliance.`
    },

    include_context: {
      title: "Background Information & Situational Awareness",
      content: `Provides comprehensive background information, situational awareness, and broader understanding of the topic and environment.

🌍 **Context Categories Included**:
• **Historical Context**: Background, evolution, and development history
• **Environmental Context**: Situational factors and external conditions
• **Technical Context**: Related systems, dependencies, and integrations
• **Business Context**: Organizational factors and business implications
• **User Context**: Audience characteristics and user needs
• **Domain Context**: Field-specific knowledge and considerations

📚 **Background Information Types**:
• Foundational concepts and prerequisites
• Related technologies and methodologies
• Industry standards and best practices
• Common challenges and solutions
• Success factors and critical considerations
• Lessons learned and historical insights

🔍 **Situational Awareness Elements**:
• Current state assessment and analysis
• Environmental factors and influences
• Stakeholder perspectives and interests
• Resource availability and constraints
• Timeline and scheduling considerations
• Risk factors and mitigation strategies

✅ **Benefits of Rich Context**:
• Helps AI understand the bigger picture and nuances
• Enables more relevant and appropriate responses
• Reduces misunderstandings and misinterpretations
• Supports better decision-making and recommendations
• Provides educational value and learning opportunities
• Enables adaptation to specific circumstances

🎯 **Implementation Approach**:
• Context is layered from general to specific
• Multiple perspectives and viewpoints are included
• Both current and historical context is provided
• Relevant examples and case studies are included
• Context is tailored to the specific domain and purpose

Rich context helps AI understand the broader situation and provide more intelligent, relevant, and effective responses.`
    },

    include_alternatives: {
      title: "Alternative Approaches & Multiple Solutions",
      content: `Offers multiple methods, solutions, approaches, and perspectives for handling situations and achieving objectives.

🔄 **Types of Alternatives Provided**:
• **Methodological Alternatives**: Different approaches to solving problems
• **Technical Alternatives**: Various tools, technologies, and implementations
• **Strategic Alternatives**: Different high-level approaches and strategies
• **Tactical Alternatives**: Various execution methods and techniques
• **Resource Alternatives**: Different resource allocation and utilization options
• **Timeline Alternatives**: Various scheduling and sequencing approaches

💡 **Alternative Categories**:
• **Primary Alternatives**: Main recommended approaches with trade-offs
• **Backup Alternatives**: Fallback options when primary approaches fail
• **Specialized Alternatives**: Domain-specific or situation-specific options
• **Innovation Alternatives**: Creative and unconventional approaches
• **Simplified Alternatives**: Easier or more accessible options
• **Advanced Alternatives**: Sophisticated or cutting-edge approaches

📊 **Comparison Framework**:
• Pros and cons analysis for each alternative
• Resource requirements and complexity comparisons
• Timeline and effort estimations
• Risk assessments and mitigation strategies
• Success probability and effectiveness ratings
• Suitability for different contexts and audiences

✅ **Benefits of Multiple Alternatives**:
• Increases flexibility and adaptability
• Accommodates different preferences and constraints
• Provides backup solutions and contingency plans
• Encourages creative thinking and innovation
• Supports different skill levels and expertise
• Enables optimization for specific circumstances

🎯 **Selection Guidance**:
• Clear criteria for choosing between alternatives
• Decision-making frameworks and considerations
• Situational factors that influence choice
• Recommendation hierarchies and preferences
• Customization guidance for specific needs

Multiple alternatives help users choose the best approach for their specific circumstances, constraints, and preferences while providing flexibility and backup options.`
    },

    include_reasoning: {
      title: "Logical Explanations & Decision Rationale",
      content: `Explains the logic, rationale, thought process, and reasoning behind recommendations, decisions, and suggestions.

🧠 **Reasoning Components Included**:
• **Decision Logic**: Step-by-step reasoning process
• **Evidence Base**: Supporting facts, data, and research
• **Cause-and-Effect Analysis**: Relationships and dependencies
• **Risk-Benefit Analysis**: Trade-off considerations
• **Assumption Identification**: Underlying assumptions and premises
• **Alternative Evaluation**: Why certain options were chosen or rejected

🔍 **Types of Reasoning Provided**:
• **Deductive Reasoning**: Logical conclusions from premises
• **Inductive Reasoning**: Patterns and generalizations from examples
• **Abductive Reasoning**: Best explanations for observations
• **Analogical Reasoning**: Comparisons and parallels
• **Causal Reasoning**: Cause-and-effect relationships
• **Probabilistic Reasoning**: Likelihood and uncertainty analysis

📋 **Reasoning Structure**:
• **Problem Analysis**: Understanding the situation and requirements
• **Option Generation**: How alternatives were identified
• **Evaluation Criteria**: Standards used for assessment
• **Comparative Analysis**: How options were compared
• **Decision Process**: How final recommendations were reached
• **Validation Logic**: How conclusions were verified

✅ **Benefits of Explicit Reasoning**:
• Provides transparency in decision-making processes
• Enables understanding of underlying logic and assumptions
• Supports learning and knowledge transfer
• Builds confidence in recommendations and suggestions
• Enables verification and validation of conclusions
• Facilitates modification and adaptation of approaches

🎓 **Educational Value**:
• Teaches critical thinking and analysis skills
• Demonstrates problem-solving methodologies
• Provides frameworks for future decision-making
• Illustrates best practices in reasoning and analysis
• Supports skill development and capability building

🔧 **Implementation Approach**:
• Reasoning is presented clearly and systematically
• Complex reasoning is broken down into understandable steps
• Visual aids and diagrams are used when helpful
• Examples and analogies illustrate reasoning concepts
• Multiple reasoning perspectives are provided when relevant

Explicit reasoning helps users understand not just what to do, but why it's recommended, building understanding, confidence, and decision-making capabilities.`
    },

    include_troubleshooting: {
      title: "Problem-Solving & Diagnostic Guidance",
      content: `Adds comprehensive guidance for handling issues, diagnosing problems, and resolving common challenges systematically.

🔧 **Troubleshooting Framework Included**:
• **Problem Identification**: Systematic issue detection and classification
• **Diagnostic Procedures**: Step-by-step problem analysis methods
• **Root Cause Analysis**: Techniques for identifying underlying causes
• **Solution Development**: Systematic approach to solution generation
• **Implementation Guidance**: How to apply solutions effectively
• **Verification Methods**: How to confirm problems are resolved

🚨 **Common Problem Categories**:
• **Technical Issues**: System failures, bugs, and malfunctions
• **Performance Problems**: Speed, efficiency, and resource issues
• **Integration Challenges**: Compatibility and connection problems
• **User Experience Issues**: Usability and accessibility problems
• **Security Concerns**: Vulnerabilities and threat responses
• **Process Breakdowns**: Workflow and methodology issues

📋 **Diagnostic Tools and Techniques**:
• **Systematic Checklists**: Comprehensive issue investigation guides
• **Decision Trees**: Logical problem diagnosis pathways
• **Testing Procedures**: Methods for isolating and confirming issues
• **Monitoring Techniques**: How to track and measure problems
• **Log Analysis**: How to interpret error messages and system logs
• **Performance Profiling**: Techniques for identifying bottlenecks

🛠️ **Solution Categories**:
• **Quick Fixes**: Immediate temporary solutions
• **Permanent Solutions**: Long-term problem resolution
• **Workarounds**: Alternative approaches when direct solutions aren't available
• **Preventive Measures**: How to avoid problems in the future
• **Escalation Procedures**: When and how to seek additional help
• **Recovery Procedures**: How to restore normal operation

✅ **Benefits of Troubleshooting Guidance**:
• Reduces downtime and resolution time
• Builds problem-solving capabilities and confidence
• Provides systematic approaches to issue resolution
• Prevents escalation of minor issues to major problems
• Supports independent problem-solving
• Improves overall system reliability and user experience

🎯 **Implementation Features**:
• Troubleshooting guides are organized by problem type and severity
• Step-by-step procedures with clear decision points
• Common error messages and their meanings
• Tools and resources needed for problem resolution
• When to seek help and how to escalate issues

Essential for technical prompts and complex processes where issues are likely to occur and systematic problem-solving is critical.`
    },

    include_best_practices: {
      title: "Industry Standards & Professional Guidelines",
      content: `Incorporates proven methodologies, professional standards, and industry best practices to ensure high-quality, reliable outcomes.

⭐ **Best Practice Categories**:
• **Industry Standards**: Established professional guidelines and conventions
• **Proven Methodologies**: Time-tested approaches and frameworks
• **Quality Standards**: Criteria for excellence and professional quality
• **Security Practices**: Established security guidelines and protocols
• **Performance Optimization**: Proven techniques for efficiency and speed
• **Maintainability Practices**: Guidelines for long-term sustainability

🏆 **Sources of Best Practices**:
• **Industry Organizations**: Professional associations and standards bodies
• **Leading Companies**: Practices from successful organizations
• **Academic Research**: Evidence-based methodologies and approaches
• **Expert Communities**: Collective wisdom from professional communities
• **Regulatory Bodies**: Compliance and regulatory requirements
• **Historical Analysis**: Lessons learned from successes and failures

📚 **Best Practice Types**:
• **Design Principles**: Fundamental guidelines for effective design
• **Implementation Patterns**: Proven approaches to common challenges
• **Quality Assurance**: Methods for ensuring quality and reliability
• **Documentation Standards**: Guidelines for clear and effective documentation
• **Communication Protocols**: Best practices for professional communication
• **Project Management**: Proven methodologies for successful project delivery

✅ **Benefits of Best Practices**:
• Ensures high-quality, professional-grade outcomes
• Reduces risk of errors and common pitfalls
• Provides proven, tested approaches and methodologies
• Supports compliance with industry standards and regulations
• Builds credibility and professional reputation
• Accelerates learning and skill development

🎯 **Implementation Approach**:
• Best practices are integrated naturally into guidance and recommendations
• Rationale and benefits of each practice are explained
• Adaptation guidelines for different contexts and situations
• Common violations and how to avoid them
• Tools and resources for implementing best practices
• Measurement and evaluation criteria for practice adoption

🔧 **Customization by Domain**:
• Software development: Coding standards, testing practices, deployment procedures
• Data science: Data quality, model validation, ethical AI practices
• Business: Strategic planning, risk management, performance measurement
• Design: User experience principles, accessibility guidelines, visual design standards
• Project management: Planning methodologies, communication protocols, quality assurance

These practices are curated from industry experience, established standards, and proven success patterns in your selected domain.`
    },

    include_warnings: {
      title: "Risk Alerts, Cautions & Safety Considerations",
      content: `Highlights potential dangers, pitfalls, risks, and important safety considerations to prevent costly errors and ensure responsible usage.

⚠️ **Warning Categories**:
• **Security Vulnerabilities**: Potential security risks and threats
• **Performance Risks**: Actions that could impact system performance
• **Data Safety**: Risks to data integrity, privacy, and security
• **Financial Risks**: Potential cost implications and budget impacts
• **Compliance Risks**: Regulatory and legal compliance considerations
• **Operational Risks**: Threats to normal business operations

🚨 **Risk Severity Levels**:
• **Critical Warnings**: Immediate threats requiring urgent attention
• **High Priority**: Significant risks that should be addressed promptly
• **Medium Priority**: Important considerations that require planning
• **Low Priority**: Minor risks that should be monitored
• **Informational**: General awareness items and considerations

🛡️ **Types of Warnings Included**:
• **Technical Warnings**: System limitations, compatibility issues, performance impacts
• **Security Alerts**: Vulnerability warnings, threat notifications, safety protocols
• **Process Cautions**: Procedural risks, methodology limitations, workflow concerns
• **Resource Warnings**: Budget implications, time constraints, resource limitations
• **Environmental Alerts**: Context-specific risks and situational hazards
• **Ethical Considerations**: Moral implications and responsible usage guidelines

📋 **Warning Components**:
• **Risk Description**: Clear explanation of the potential danger or issue
• **Impact Assessment**: Potential consequences and severity levels
• **Probability Analysis**: Likelihood of occurrence and triggering conditions
• **Prevention Strategies**: How to avoid or minimize the risk
• **Mitigation Plans**: What to do if the risk materializes
• **Monitoring Guidelines**: How to watch for early warning signs

✅ **Benefits of Comprehensive Warnings**:
• Prevents costly mistakes and errors before they occur
• Ensures safe and responsible usage of tools and methodologies
• Supports informed decision-making with full risk awareness
• Protects against security vulnerabilities and threats
• Maintains compliance with regulations and standards
• Builds risk management capabilities and awareness

🎯 **Implementation Features**:
• Warnings are prominently displayed and clearly marked
• Risk levels are clearly indicated with appropriate visual cues
• Context-specific warnings based on user selections and domain
• Actionable guidance for risk prevention and mitigation
• Regular updates to reflect emerging threats and new risks
• Integration with relevant tools and monitoring systems

Critical for preventing costly errors, ensuring safe usage, and maintaining security, compliance, and operational integrity.`
    },

    include_resources: {
      title: "Additional References & Learning Materials",
      content: `Provides comprehensive links to documentation, tools, learning materials, and support resources to extend knowledge and capabilities.

📚 **Resource Categories**:
• **Official Documentation**: Authoritative guides, manuals, and specifications
• **Learning Materials**: Tutorials, courses, books, and educational content
• **Tool Resources**: Software tools, utilities, and helpful applications
• **Community Resources**: Forums, communities, and peer support networks
• **Reference Materials**: Quick references, cheat sheets, and lookup guides
• **Advanced Resources**: Research papers, case studies, and expert content

🔗 **Types of Resources Included**:
• **Primary Sources**: Official documentation and authoritative references
• **Educational Content**: Structured learning materials and courses
• **Practical Tools**: Software, utilities, and helpful applications
• **Community Support**: Forums, discussion groups, and peer networks
• **Expert Content**: Articles, blogs, and insights from industry experts
• **Research Materials**: Academic papers, studies, and research findings

🎯 **Resource Selection Criteria**:
• **Quality**: High-quality, accurate, and reliable content
• **Relevance**: Directly applicable to the topic and domain
• **Currency**: Up-to-date and current information
• **Accessibility**: Free or reasonably accessible resources
• **Authority**: Credible sources and recognized experts
• **Practicality**: Actionable and immediately useful content

📋 **Resource Organization**:
• **By Topic**: Resources organized by subject area and theme
• **By Type**: Grouped by resource type (documentation, tools, tutorials)
• **By Level**: Categorized by skill level and complexity
• **By Purpose**: Organized by intended use and application
• **By Format**: Grouped by format (video, text, interactive, tools)

✅ **Benefits of Rich Resource Libraries**:
• Extends the prompt's value beyond immediate guidance
• Connects users to broader knowledge and support systems
• Enables continuous learning and skill development
• Provides authoritative references for verification
• Supports deeper exploration of topics and concepts
• Builds comprehensive knowledge networks

🔧 **Implementation Features**:
• Resources are carefully curated and vetted for quality
• Brief descriptions explain the value and purpose of each resource
• Resources are organized for easy navigation and discovery
• Regular updates ensure currency and relevance
• Multiple resource types accommodate different learning preferences
• Integration with specific recommendations and guidance

These resources extend the prompt's capabilities by connecting users to comprehensive knowledge networks, tools, and support systems for continued learning and development.`
    },

    include_validation: {
      title: "Quality Verification & Success Confirmation",  
      content: `Includes comprehensive methods to verify correctness, completeness, quality, and success of results and implementations.

✅ **Validation Method Categories**:
• **Quality Checklists**: Systematic quality assessment criteria
• **Testing Procedures**: Methods for verifying functionality and correctness
• **Verification Steps**: Processes for confirming requirements are met
• **Success Criteria**: Clear definitions of successful outcomes
• **Review Protocols**: Systematic review and evaluation procedures
• **Measurement Methods**: Quantitative and qualitative assessment techniques

🔍 **Types of Validation Included**:
• **Functional Validation**: Confirming that solutions work as intended
• **Quality Validation**: Ensuring outputs meet quality standards
• **Compliance Validation**: Verifying adherence to requirements and regulations
• **Performance Validation**: Confirming efficiency and performance targets
• **Security Validation**: Ensuring security requirements are met
• **User Acceptance Validation**: Confirming user satisfaction and usability

📋 **Validation Framework Components**:
• **Pre-Implementation Validation**: Checks before starting work
• **In-Process Validation**: Ongoing verification during implementation
• **Post-Implementation Validation**: Final verification of completed work
• **Acceptance Criteria**: Clear standards for successful completion
• **Test Cases**: Specific scenarios for validation testing
• **Review Checklists**: Systematic evaluation guidelines

🎯 **Validation Techniques**:
• **Peer Review**: Having others evaluate and verify work
• **Automated Testing**: Using tools and scripts for verification
• **Manual Testing**: Human verification and evaluation processes
• **User Testing**: Validation with actual users and stakeholders
• **Performance Testing**: Measuring and verifying performance metrics
• **Security Testing**: Evaluating security and vulnerability aspects

✅ **Benefits of Validation Methods**:
• Helps users confirm their results meet requirements
• Identifies potential issues and problems early
• Builds confidence in solutions and implementations
• Ensures quality and professional standards
• Supports continuous improvement and learning
• Reduces risk of failure and rework

🔧 **Implementation Features**:
• Validation methods are tailored to specific domains and contexts
• Step-by-step procedures with clear decision criteria
• Tools and resources for conducting validation
• Common validation pitfalls and how to avoid them
• Integration with quality standards and best practices
• Measurement and reporting guidelines

Validation methods help users confirm their results are correct, complete, and meet all requirements while identifying and addressing issues early in the process.`
    },

    // Quality Improvements with enhanced descriptions
    improve_clarity: {
      title: "Enhanced Readability & Communication Clarity",
      content: `Significantly improves how clearly, understandably, and effectively information is communicated to users.

🔍 **Clarity Improvement Techniques**:
• **Language Simplification**: Removes unnecessary complexity and jargon
• **Structure Enhancement**: Improves logical organization and flow
• **Ambiguity Elimination**: Removes vague and confusing language
• **Concept Clarification**: Makes abstract ideas concrete and understandable
• **Instruction Precision**: Makes directions clear and actionable
• **Visual Organization**: Improves formatting and visual hierarchy

📝 **Writing and Communication Enhancements**:
• **Sentence Structure**: Improves readability with varied, clear sentences
• **Paragraph Organization**: Logical grouping of related ideas
• **Transition Improvement**: Smooth connections between concepts
• **Active Voice Usage**: Clear, direct communication style
• **Concrete Examples**: Specific illustrations of abstract concepts
• **Consistent Terminology**: Uniform use of terms and definitions

🎯 **Clarity Focus Areas**:
• **Purpose Clarity**: Clear explanation of objectives and goals
• **Process Clarity**: Step-by-step procedures that are easy to follow
• **Requirement Clarity**: Unambiguous specifications and expectations
• **Outcome Clarity**: Clear definition of expected results
• **Decision Clarity**: Clear criteria for choices and decisions
• **Action Clarity**: Specific, actionable instructions and guidance

✅ **Benefits of Improved Clarity**:
• Reduces confusion, misunderstandings, and errors
• Improves task completion rates and success
• Decreases time needed to understand and implement
• Enhances user confidence and satisfaction
• Reduces need for clarification and support
• Improves accessibility for diverse audiences

🔧 **Implementation Methods**:
• Systematic review and revision of all content
• User-centered language and terminology choices
• Logical information architecture and organization
• Clear headings, subheadings, and section breaks
• Consistent formatting and visual presentation
• Integration of examples and illustrations

📊 **Clarity Assessment Criteria**:
• **Comprehensibility**: Can users easily understand the content?
• **Actionability**: Are instructions clear and implementable?
• **Completeness**: Is all necessary information provided?
• **Consistency**: Is terminology and style consistent throughout?
• **Accessibility**: Is content accessible to the target audience?
• **Efficiency**: Can users quickly find and use needed information?

Results in prompts that are easier to understand, follow, and implement successfully, reducing confusion and errors while improving user experience and outcomes.`
    },

    enhance_specificity: {
      title: "Precision & Actionable Detail Enhancement",
      content: `Makes instructions more precise, specific, actionable, and measurably clear to eliminate ambiguity and improve implementation success.

🎯 **Specificity Enhancement Areas**:
• **Action Specification**: Clear, concrete actions rather than vague suggestions
• **Parameter Definition**: Specific values, ranges, and criteria
• **Outcome Specification**: Measurable, observable results and deliverables
• **Criteria Clarification**: Exact standards and evaluation methods
• **Process Detail**: Step-by-step procedures with specific instructions
• **Resource Specification**: Exact tools, materials, and requirements

📋 **Precision Improvement Techniques**:
• **Quantification**: Adding numbers, measurements, and specific values
• **Standardization**: Using established standards and conventions
• **Categorization**: Specific classifications and groupings
• **Exemplification**: Concrete examples and specific instances
• **Operationalization**: Converting abstract concepts into specific actions
• **Verification**: Specific methods for confirming completion and quality

🔧 **Implementation Specificity**:
• **Tool Specification**: Exact tools, versions, and configurations
• **Environment Details**: Specific setup requirements and conditions
• **Input Specifications**: Exact format, structure, and content requirements
• **Output Specifications**: Precise format, content, and quality criteria
• **Timeline Specificity**: Exact durations, deadlines, and scheduling
• **Role Clarification**: Specific responsibilities and accountability

✅ **Benefits of Enhanced Specificity**:
• Reduces vagueness and interpretation errors
• Provides clear, implementable guidance
• Enables consistent results and outcomes
• Supports quality assurance and validation
• Improves efficiency and reduces rework
• Enables better planning and resource allocation

📊 **Specificity Metrics**:
• **Measurability**: Can outcomes be objectively measured?
• **Actionability**: Are instructions immediately implementable?
• **Completeness**: Are all details and requirements specified?
• **Clarity**: Are specifications unambiguous and clear?
• **Feasibility**: Are specifications realistic and achievable?
• **Verifiability**: Can completion and quality be verified?

🎯 **Domain-Specific Enhancements**:
• **Technical Specifications**: Exact technical requirements and parameters
• **Process Specifications**: Detailed procedural steps and methods
• **Quality Specifications**: Precise quality criteria and standards
• **Performance Specifications**: Specific performance targets and metrics
• **Compliance Specifications**: Exact regulatory and standard requirements
• **Integration Specifications**: Specific interface and integration requirements

Reduces vagueness and provides clear, actionable guidance that produces consistent, measurable results while eliminating ambiguity and interpretation errors.`
    },

    boost_creativity: {
      title: "Innovation & Creative Thinking Enhancement",
      content: `Encourages innovative thinking, creative problem-solving, original approaches, and breakthrough solutions.

🎨 **Creativity Enhancement Techniques**:
• **Brainstorming Methods**: Structured ideation and idea generation techniques
• **Lateral Thinking**: Alternative approaches and unconventional solutions
• **Design Thinking**: Human-centered, iterative problem-solving approaches
• **Innovation Frameworks**: Systematic approaches to innovation and creativity
• **Inspiration Sources**: Diverse examples and creative stimuli
• **Constraint Creativity**: Using limitations to drive innovative solutions

💡 **Creative Thinking Approaches**:
• **Divergent Thinking**: Generating multiple, diverse solutions and ideas
• **Convergent Thinking**: Refining and developing the best creative ideas
• **Analogical Thinking**: Drawing inspiration from different domains
• **Metaphorical Thinking**: Using metaphors and analogies for insight
• **Systems Thinking**: Understanding creative solutions in context
• **Future Thinking**: Envisioning possibilities and potential developments

🌟 **Innovation Stimulation Methods**:
• **Cross-Pollination**: Combining ideas from different fields and domains
• **Question Reframing**: Asking different questions to unlock new perspectives
• **Assumption Challenging**: Questioning and overturning conventional assumptions
• **Perspective Shifting**: Viewing problems from different angles and viewpoints
• **Experimentation**: Encouraging trial, error, and iterative improvement
• **Collaboration**: Leveraging diverse perspectives and collective creativity

✅ **Benefits of Creativity Enhancement**:
• Generates innovative and original solutions
• Breaks through conventional limitations and constraints
• Discovers unexpected opportunities and possibilities
• Improves adaptability and flexibility in problem-solving
• Enhances engagement and motivation through creative challenge
• Develops creative capabilities and innovative thinking skills

🎯 **Creative Application Areas**:
• **Problem Solving**: Novel approaches to challenging problems
• **Product Development**: Innovative features, designs, and solutions
• **Process Innovation**: Creative improvements to workflows and methods
• **Strategic Thinking**: Original approaches to business and organizational challenges
• **Artistic Expression**: Creative and aesthetic considerations
• **Communication**: Innovative ways to present and share information

🔧 **Implementation Features**:
• **Creative Prompts**: Specific questions and challenges to stimulate creativity
• **Innovation Exercises**: Structured activities for creative thinking
• **Inspiration Libraries**: Collections of creative examples and case studies
• **Collaboration Tools**: Methods for creative teamwork and co-creation
• **Evaluation Frameworks**: Criteria for assessing creative solutions
• **Implementation Support**: Guidance for turning creative ideas into reality

🌈 **Creative Thinking Patterns**:
• **What-If Scenarios**: Exploring possibilities and alternative futures
• **Reverse Thinking**: Working backwards from desired outcomes
• **Random Stimulation**: Using unexpected inputs to trigger new ideas
• **Morphological Analysis**: Systematic exploration of solution combinations
• **SCAMPER Technique**: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse
• **Six Thinking Hats**: Structured approach to creative and critical thinking

Particularly valuable for design, writing, problem-solving, and innovation-focused prompts where originality, breakthrough thinking, and creative solutions are important.`
    },

    strengthen_structure: {
      title: "Logical Organization & Information Architecture",
      content: `Improves logical flow, hierarchical organization, information architecture, and structural coherence of content.

🏗️ **Structural Enhancement Areas**:
• **Information Hierarchy**: Clear organization of information by importance and relevance
• **Logical Progression**: Sequential flow that builds understanding step-by-step
• **Section Organization**: Coherent grouping of related content and topics
• **Navigation Structure**: Clear pathways for finding and accessing information
• **Content Architecture**: Systematic organization of all content elements
• **Relationship Mapping**: Clear connections between related concepts and sections

📊 **Organizational Frameworks**:
• **Chronological Structure**: Time-based organization for processes and procedures
• **Hierarchical Structure**: Importance-based organization with clear levels
• **Categorical Structure**: Topic-based organization with clear groupings
• **Problem-Solution Structure**: Challenge-focused organization with systematic solutions
• **Compare-Contrast Structure**: Comparative analysis and evaluation frameworks
• **Cause-Effect Structure**: Logical chains of causation and consequences

🔧 **Structural Improvement Techniques**:
• **Outline Development**: Creating clear, logical content outlines
• **Section Numbering**: Systematic numbering and referencing systems
• **Cross-Referencing**: Links and connections between related sections
• **Summary Integration**: Strategic placement of summaries and overviews
• **Transition Enhancement**: Smooth connections between sections and topics
• **Index Creation**: Comprehensive reference and lookup systems

✅ **Benefits of Strong Structure**:
• Makes prompts easier to follow and navigate
• Improves comprehension and information retention
• Reduces cognitive load and mental effort
• Enables efficient information retrieval and reference
• Supports systematic thinking and problem-solving
• Enhances professional appearance and credibility

📋 **Structure Quality Criteria**:
• **Logical Flow**: Does information progress in a logical sequence?
• **Clear Hierarchy**: Are importance levels and relationships clear?
• **Complete Coverage**: Are all necessary topics included and organized?
• **Balanced Sections**: Are sections appropriately sized and detailed?
• **Easy Navigation**: Can users easily find and access needed information?
• **Coherent Grouping**: Are related topics grouped together logically?

🎯 **Structural Elements**:
• **Introduction and Overview**: Clear purpose, scope, and roadmap
• **Main Content Sections**: Logically organized core information
• **Supporting Materials**: Examples, references, and additional resources
• **Summary and Conclusion**: Key takeaways and next steps
• **Appendices**: Detailed reference materials and supplementary content
• **Navigation Aids**: Table of contents, index, and cross-references

🔍 **Organization Patterns**:
• **Top-Down Structure**: General to specific information flow
• **Bottom-Up Structure**: Specific to general concept building
• **Spiral Structure**: Iterative deepening of understanding
• **Modular Structure**: Independent, interchangeable sections
• **Network Structure**: Interconnected, non-linear organization
• **Layered Structure**: Multiple levels of detail and complexity

Better structure makes prompts more effective at guiding users through complex information and processes while reducing confusion and cognitive load.`
    },

    add_error_handling: {
      title: "Failure Management & Recovery Procedures",
      content: `Includes comprehensive strategies for managing errors, failures, edge cases, and unexpected situations with systematic recovery procedures.

🛠️ **Error Handling Framework**:
• **Error Prevention**: Proactive measures to prevent common errors
• **Error Detection**: Methods for identifying when errors occur
• **Error Classification**: Categorizing errors by type, severity, and impact
• **Error Recovery**: Systematic procedures for recovering from errors
• **Error Reporting**: Methods for documenting and communicating errors
• **Error Analysis**: Techniques for understanding root causes

🚨 **Error Categories Addressed**:
• **Input Errors**: Invalid, missing, or malformed input data
• **Process Errors**: Failures during execution and processing
• **System Errors**: Technical failures and system-level issues
• **Integration Errors**: Problems with external systems and services
• **User Errors**: Mistakes and misunderstandings by users
• **Environmental Errors**: Issues caused by external conditions

📋 **Error Handling Strategies**:
• **Graceful Degradation**: Maintaining functionality when components fail
• **Fallback Procedures**: Alternative approaches when primary methods fail
• **Error Isolation**: Containing errors to prevent cascading failures
• **Recovery Protocols**: Step-by-step procedures for restoring normal operation
• **Retry Mechanisms**: Systematic approaches to retrying failed operations
• **Circuit Breakers**: Preventing system overload during failure conditions

🔧 **Recovery Procedures**:
• **Immediate Response**: Quick actions to minimize impact and damage
• **Diagnosis Procedures**: Systematic methods for identifying root causes
• **Corrective Actions**: Steps to fix the underlying problems
• **Restoration Procedures**: Methods for returning to normal operation
• **Verification Steps**: Confirming that recovery was successful
• **Documentation Requirements**: Recording incidents and resolutions

✅ **Benefits of Comprehensive Error Handling**:
• Increases system reliability and robustness
• Reduces downtime and service interruptions
• Improves user experience during problem situations
• Enables faster problem resolution and recovery
• Builds confidence in system reliability
• Supports continuous improvement through error analysis

🎯 **Error Handling Components**:
• **Error Detection Mechanisms**: How to identify that errors have occurred
• **Error Messaging**: Clear, helpful error messages and notifications
• **Logging and Monitoring**: Systematic recording of errors and system state
• **User Guidance**: Instructions for users when errors occur
• **Administrative Procedures**: Actions for administrators and support staff
• **Escalation Procedures**: When and how to escalate serious issues

🔍 **Error Prevention Strategies**:
• **Input Validation**: Checking data before processing
• **Boundary Checking**: Ensuring operations stay within safe limits
• **Resource Monitoring**: Tracking system resources and capacity
• **Dependency Management**: Handling external system dependencies
• **Configuration Validation**: Ensuring proper system setup
• **Testing Procedures**: Comprehensive testing to catch errors early

🛡️ **Failure Scenarios Covered**:
• **Partial Failures**: When some components work while others fail
• **Complete Failures**: When entire systems or processes fail
• **Intermittent Failures**: Sporadic, hard-to-reproduce problems
• **Cascading Failures**: When one failure triggers additional failures
• **Performance Degradation**: When systems slow down but don't fail completely
• **Data Corruption**: When information becomes damaged or invalid

Essential for robust prompts that need to work reliably in various conditions and handle unexpected situations gracefully while maintaining user confidence and system integrity.`
    },

    improve_flow: {
      title: "Narrative Progression & Information Flow",
      content: `Enhances transitions between ideas, creates smoother reading experience, and optimizes information progression for better comprehension.

🌊 **Flow Enhancement Techniques**:
• **Transition Improvement**: Smooth connections between sections and ideas
• **Logical Sequencing**: Optimal ordering of information and concepts
• **Narrative Coherence**: Consistent voice and perspective throughout
• **Pacing Optimization**: Appropriate rhythm and tempo of information delivery
• **Connection Strengthening**: Clear relationships between related concepts
• **Continuity Maintenance**: Consistent themes and approaches throughout

📝 **Transition Methods**:
• **Bridging Sentences**: Sentences that connect different sections and topics
• **Transitional Phrases**: Words and phrases that signal relationships and progression
• **Conceptual Links**: Explicit connections between related ideas
• **Progressive Disclosure**: Gradual revelation of information in logical order
• **Recap and Preview**: Summary of previous content and preview of upcoming content
• **Thematic Threads**: Consistent themes that run throughout the content

🔄 **Information Progression Patterns**:
• **Sequential Flow**: Step-by-step progression through related topics
• **Hierarchical Flow**: Movement from general to specific or important to detailed
• **Spiral Flow**: Iterative deepening of understanding through repetition and elaboration
• **Parallel Flow**: Multiple related streams of information presented together
• **Convergent Flow**: Multiple topics coming together toward a unified conclusion
• **Divergent Flow**: Single topic expanding into multiple related areas

✅ **Benefits of Improved Flow**:
• Keeps users engaged and prevents confusion
• Helps users follow complex information more easily
• Reduces cognitive load and mental effort
• Improves comprehension and retention
• Creates more professional and polished content
• Enhances overall user experience and satisfaction

🎯 **Flow Quality Indicators**:
• **Smoothness**: Are transitions natural and easy to follow?
• **Logic**: Does the information progress in a logical sequence?
• **Coherence**: Do all parts work together toward common objectives?
• **Engagement**: Does the flow maintain user interest and attention?
• **Clarity**: Is the progression clear and understandable?
• **Efficiency**: Does the flow efficiently convey information?

📊 **Flow Optimization Strategies**:
• **Reader Journey Mapping**: Understanding how users will progress through content
• **Information Architecture**: Organizing content for optimal user flow
• **Cognitive Load Management**: Balancing information density and complexity
• **Attention Management**: Strategic placement of important information
• **Engagement Techniques**: Methods for maintaining user interest and focus
• **Feedback Integration**: Incorporating user feedback to improve flow

🔧 **Implementation Techniques**:
• **Outline Refinement**: Improving content structure for better flow
• **Paragraph Optimization**: Ensuring each paragraph contributes to overall flow
• **Sentence Variation**: Using varied sentence structures for better rhythm
• **Visual Flow**: Using formatting and layout to support information flow
• **Content Chunking**: Breaking information into digestible, flowing segments
• **Redundancy Elimination**: Removing repetitive or disruptive content

🌟 **Advanced Flow Techniques**:
• **Narrative Arc**: Creating compelling story-like progression
• **Tension and Release**: Building anticipation and providing resolution
• **Rhythm Variation**: Varying pacing to maintain interest
• **Emphasis Placement**: Strategic highlighting of key information
• **Flow Recovery**: Techniques for getting back on track after disruptions
• **Multi-Modal Flow**: Coordinating text, visuals, and interactive elements

Better flow keeps users engaged, helps them follow complex information more easily, and creates a more professional, satisfying user experience.`
    },

    enhance_readability: {
      title: "Visual Organization & Accessibility Optimization",
      content: `Optimizes text formatting, visual hierarchy, spacing, and presentation elements for easy scanning, comprehension, and accessibility.

👁️ **Visual Enhancement Areas**:
• **Typography Optimization**: Font choices, sizing, and text formatting
• **White Space Management**: Strategic use of spacing and visual breaks
• **Visual Hierarchy**: Clear importance levels through formatting
• **Scanning Optimization**: Easy identification of key information
• **Layout Organization**: Logical placement and grouping of elements
• **Accessibility Compliance**: Ensuring content is accessible to all users

📝 **Text Formatting Improvements**:
• **Paragraph Structure**: Optimal paragraph length and organization
• **Bullet Point Usage**: Strategic use of lists for scannable content
• **Header Hierarchy**: Clear section organization with consistent formatting
• **Emphasis Techniques**: Appropriate use of bold, italic, and highlighting
• **Font Consistency**: Uniform typography throughout the content
• **Line Spacing**: Optimal spacing for readability and comprehension

🎨 **Visual Design Elements**:
• **Color Usage**: Strategic use of color for organization and emphasis
• **Contrast Optimization**: Ensuring sufficient contrast for readability
• **Visual Grouping**: Using visual elements to group related information
• **Alignment Consistency**: Consistent alignment and formatting patterns
• **Visual Balance**: Balanced distribution of visual elements
• **Progressive Disclosure**: Revealing information in digestible chunks

✅ **Readability Benefits**:
• Makes prompts more accessible to diverse audiences
• Reduces cognitive load and reading fatigue
• Improves information scanning and retrieval
• Enhances professional appearance and credibility
• Supports different reading preferences and styles
• Increases user engagement and completion rates

📊 **Readability Metrics**:
• **Scanning Efficiency**: How quickly can users find key information?
• **Comprehension Speed**: How quickly can users understand content?
• **Visual Clarity**: Are visual elements clear and unambiguous?
• **Accessibility Compliance**: Does content meet accessibility standards?
• **Device Compatibility**: Does content work well across different devices?
• **User Preference**: Do users find the content visually appealing?

🔧 **Implementation Techniques**:
• **Content Chunking**: Breaking large blocks of text into smaller, manageable sections
• **Information Layering**: Organizing information in logical, accessible layers
• **Visual Cues**: Using visual elements to guide attention and understanding
• **Consistent Formatting**: Maintaining uniform appearance throughout
• **Responsive Design**: Ensuring content works well on different screen sizes
• **User Testing**: Validating readability with actual users

🌐 **Accessibility Considerations**:
• **Screen Reader Compatibility**: Ensuring content works with assistive technologies
• **Color Blindness Support**: Using color combinations that work for all users
• **Motor Accessibility**: Designing for users with motor impairments
• **Cognitive Accessibility**: Supporting users with cognitive differences
• **Language Accessibility**: Clear, simple language when appropriate
• **Navigation Accessibility**: Easy-to-use navigation and interaction elements

📱 **Multi-Device Optimization**:
• **Mobile Readability**: Optimizing for small screens and touch interfaces
• **Desktop Readability**: Taking advantage of larger screens and precise input
• **Tablet Compatibility**: Balancing mobile and desktop considerations
• **Print Compatibility**: Ensuring content works well when printed
• **High-DPI Support**: Supporting high-resolution displays
• **Bandwidth Consideration**: Optimizing for different connection speeds

🎯 **Readability Testing Methods**:
• **User Testing**: Observing real users interacting with content
• **Automated Analysis**: Using tools to assess readability metrics
• **Expert Review**: Having readability experts evaluate content
• **A/B Testing**: Comparing different formatting approaches
• **Analytics Review**: Analyzing user behavior and engagement data
• **Accessibility Audits**: Systematic evaluation of accessibility compliance

Makes prompts more accessible, reduces cognitive load, and provides a better user experience across diverse audiences, devices, and usage contexts.`
    },

    add_edge_cases: {
      title: "Boundary Conditions & Exception Handling",
      content: `Considers unusual scenarios, exceptions, boundary conditions, and edge cases that might occur in real-world usage.

🔍 **Edge Case Categories**:
• **Input Edge Cases**: Unusual, extreme, or malformed input scenarios
• **Environmental Edge Cases**: Unusual system or environmental conditions
• **Scale Edge Cases**: Very large, very small, or unusual scale scenarios
• **Timing Edge Cases**: Unusual timing, sequencing, or concurrency issues
• **Integration Edge Cases**: Unusual interactions with external systems
• **User Behavior Edge Cases**: Unexpected or unusual user actions

📋 **Boundary Condition Types**:
• **Minimum Values**: Behavior at the smallest possible inputs or conditions
• **Maximum Values**: Behavior at the largest possible inputs or conditions
• **Zero Values**: Special handling for zero, null, or empty conditions
• **Negative Values**: Handling negative inputs where they might be unexpected
• **Overflow Conditions**: Situations where limits are exceeded
• **Underflow Conditions**: Situations where minimum thresholds aren't met

🚨 **Exception Scenarios**:
• **Resource Exhaustion**: When memory, storage, or other resources are depleted
• **Network Failures**: Connectivity issues and communication problems
• **Permission Denied**: Authorization and access control failures
• **Data Corruption**: Situations where data becomes invalid or damaged
• **Timeout Conditions**: When operations take longer than expected
• **Concurrent Access**: Multiple users or processes accessing the same resources

🛠️ **Edge Case Handling Strategies**:
• **Input Validation**: Comprehensive checking of all inputs and parameters
• **Graceful Degradation**: Maintaining functionality when edge conditions occur
• **Error Recovery**: Systematic approaches to recovering from edge case failures
• **Alternative Paths**: Backup approaches when primary methods encounter edge cases
• **User Notification**: Informing users about edge case situations
• **Logging and Monitoring**: Recording edge case occurrences for analysis

✅ **Benefits of Edge Case Coverage**:
• Increases prompt robustness and reliability
• Prevents failures in unexpected situations
• Improves user confidence and trust
• Reduces support burden and troubleshooting needs
• Enables operation in diverse, real-world conditions
• Supports comprehensive testing and validation

🎯 **Edge Case Identification Methods**:
• **Systematic Analysis**: Methodical examination of all possible scenarios
• **Historical Analysis**: Learning from past failures and issues
• **Stress Testing**: Testing with extreme conditions and unusual inputs
• **User Behavior Analysis**: Understanding how users actually interact with systems
• **Environmental Analysis**: Considering different operating environments
• **Integration Analysis**: Examining interactions with external systems

📊 **Edge Case Documentation**:
• **Scenario Description**: Clear explanation of the edge case situation
• **Trigger Conditions**: What causes the edge case to occur
• **Expected Behavior**: How the system should respond
• **Handling Procedures**: Specific steps for managing the edge case
• **Recovery Methods**: How to return to normal operation
• **Prevention Strategies**: How to avoid the edge case when possible

🔧 **Implementation Approaches**:
• **Defensive Programming**: Writing code that anticipates and handles edge cases
• **Input Sanitization**: Cleaning and validating all inputs before processing
• **Boundary Testing**: Systematic testing of boundary conditions
• **Exception Handling**: Comprehensive error handling and recovery procedures
• **Monitoring Systems**: Automated detection of edge case occurrences
• **Documentation Standards**: Clear documentation of edge case handling

🌟 **Advanced Edge Case Considerations**:
• **Cascading Effects**: How edge cases in one area might affect other areas
• **Recovery Complexity**: Managing complex recovery scenarios
• **Performance Impact**: Edge case handling effects on normal operation
• **Security Implications**: Edge cases that might create security vulnerabilities
• **Data Integrity**: Maintaining data consistency during edge case handling
• **User Experience**: Minimizing user impact during edge case situations

Increases prompt robustness and reliability by addressing scenarios that might otherwise cause failures, ensuring the prompt works effectively in diverse, real-world conditions.`
    },

    improve_coherence: {
      title: "Thematic Unity & Logical Consistency",
      content: `Strengthens logical consistency, thematic unity, terminological consistency, and overall harmony of content throughout the prompt.

🎯 **Coherence Enhancement Areas**:
• **Thematic Consistency**: Unified themes and approaches throughout
• **Terminological Consistency**: Uniform use of terms and definitions
• **Logical Consistency**: Absence of contradictions and logical conflicts
• **Stylistic Consistency**: Uniform voice, tone, and presentation style
• **Structural Consistency**: Consistent organization and formatting patterns
• **Conceptual Consistency**: Harmonious integration of all concepts and ideas

📝 **Consistency Types**:
• **Language Consistency**: Uniform vocabulary, grammar, and style
• **Format Consistency**: Consistent formatting, layout, and presentation
• **Content Consistency**: Harmonious integration of all content elements
• **Approach Consistency**: Unified methodology and problem-solving approaches
• **Quality Consistency**: Uniform quality standards throughout
• **Reference Consistency**: Consistent citation and reference styles

🔧 **Coherence Improvement Techniques**:
• **Terminology Standardization**: Creating and maintaining consistent vocabulary
• **Cross-Reference Validation**: Ensuring all references and links are accurate
• **Contradiction Elimination**: Identifying and resolving conflicting information
• **Theme Reinforcement**: Strengthening consistent themes throughout
• **Style Guide Application**: Applying consistent style and formatting rules
• **Unity Testing**: Systematic evaluation of overall coherence

✅ **Benefits of Strong Coherence**:
• Ensures all parts of the prompt work together effectively
• Reduces confusion and misunderstandings
• Improves professional appearance and credibility
• Enhances user confidence and trust
• Supports better learning and comprehension
• Creates more effective and reliable guidance

📊 **Coherence Quality Indicators**:
• **Logical Consistency**: Are there any contradictions or logical conflicts?
• **Thematic Unity**: Do all parts support common objectives and themes?
• **Terminological Consistency**: Are terms used consistently throughout?
• **Stylistic Harmony**: Is the voice and style consistent?
• **Structural Alignment**: Do formatting and organization patterns align?
• **Conceptual Integration**: Do all concepts work together harmoniously?

🎨 **Unity Building Strategies**:
• **Central Theme Development**: Establishing and maintaining core themes
• **Narrative Thread Weaving**: Creating consistent narrative elements
• **Conceptual Framework Application**: Using unified conceptual approaches
• **Voice Consistency**: Maintaining consistent personality and perspective
• **Visual Consistency**: Uniform visual elements and presentation
• **Message Consistency**: Aligned messaging and communication

🔍 **Coherence Validation Methods**:
• **Comprehensive Review**: Systematic evaluation of all content for consistency
• **Cross-Reference Checking**: Verifying all internal references and connections
• **Terminology Auditing**: Reviewing all terms and definitions for consistency
• **Logic Validation**: Checking for contradictions and logical conflicts
• **Theme Analysis**: Evaluating thematic consistency and unity
• **User Testing**: Validating coherence from user perspective

🌟 **Advanced Coherence Techniques**:
• **Conceptual Mapping**: Visualizing relationships between all concepts
• **Dependency Analysis**: Understanding how different parts depend on each other
• **Integration Testing**: Testing how different sections work together
• **Holistic Optimization**: Optimizing the prompt as a unified whole
• **Emergent Property Management**: Managing properties that emerge from the whole
• **System Perspective**: Viewing the prompt as an integrated system

🔧 **Implementation Strategies**:
• **Master Document Management**: Maintaining authoritative source documents
• **Version Control**: Tracking changes and maintaining consistency across versions
• **Review Protocols**: Systematic review processes for maintaining coherence
• **Style Guide Enforcement**: Ensuring consistent application of style standards
• **Quality Assurance**: Comprehensive QA processes for coherence validation
• **Continuous Improvement**: Ongoing refinement of coherence and consistency

Ensures all parts of the prompt work together effectively toward the same objectives, creating a unified, professional, and reliable user experience.`
    },

    add_context_awareness: {
      title: "Situational Intelligence & Environmental Adaptation",
      content: `Increases sensitivity to environmental factors, user context, situational variables, and enables adaptive responses based on circumstances.

🌍 **Context Awareness Categories**:
• **User Context**: Understanding user background, skills, and current situation
• **Environmental Context**: Current conditions, constraints, and available resources
• **Temporal Context**: Timing, deadlines, and time-sensitive considerations
• **Organizational Context**: Company culture, policies, and organizational factors
• **Technical Context**: Current technology stack, systems, and technical environment
• **Domain Context**: Industry-specific factors and domain considerations

🔍 **Situational Factors Considered**:
• **Current State Assessment**: Understanding the present situation and conditions
• **Resource Availability**: Available tools, budget, time, and human resources
• **Constraint Recognition**: Identifying limitations and restrictions
• **Stakeholder Considerations**: Understanding different stakeholder perspectives
• **Risk Environment**: Current risk levels and risk tolerance
• **Change Factors**: Ongoing changes and their implications

📊 **Adaptive Response Mechanisms**:
• **Conditional Guidance**: Different recommendations based on different conditions
• **Scalable Solutions**: Approaches that adapt to different scales and contexts
• **Resource-Aware Recommendations**: Suggestions that consider available resources
• **Risk-Adjusted Approaches**: Methods that adapt to different risk levels
• **Timeline-Sensitive Planning**: Approaches that consider time constraints
• **Skill-Level Adaptation**: Guidance that adapts to user expertise levels

✅ **Benefits of Context Awareness**:
• Helps prompts adapt their responses to specific circumstances
• Provides more relevant and appropriate guidance
• Improves effectiveness by considering real-world constraints
• Reduces misalignment between recommendations and actual situations
• Supports better decision-making with situational intelligence
• Increases user satisfaction through personalized guidance

🎯 **Context Integration Methods**:
• **Situational Assessment**: Methods for understanding current context
• **Context Profiling**: Creating profiles of different contextual scenarios
• **Adaptive Algorithms**: Rules for adapting responses to different contexts
• **Context Validation**: Methods for confirming contextual understanding
• **Dynamic Adjustment**: Real-time adaptation to changing circumstances
• **Context Documentation**: Recording and learning from contextual patterns

🔧 **Implementation Strategies**:
• **Context Questionnaires**: Structured methods for gathering contextual information
• **Environmental Scanning**: Systematic assessment of environmental factors
• **Stakeholder Analysis**: Understanding different perspectives and interests
• **Constraint Mapping**: Identifying and documenting limitations and restrictions
• **Resource Assessment**: Evaluating available resources and capabilities
• **Situation Modeling**: Creating models of different situational scenarios

🌟 **Advanced Context Features**:
• **Predictive Context**: Anticipating future contextual changes
• **Context Learning**: Improving contextual understanding over time
• **Multi-Context Integration**: Handling multiple, overlapping contextual factors
• **Context Prioritization**: Determining which contextual factors are most important
• **Context Conflict Resolution**: Managing conflicting contextual requirements
• **Context Communication**: Explaining contextual considerations to users

📋 **Contextual Adaptation Examples**:
• **Budget Constraints**: Different approaches for different budget levels
• **Time Constraints**: Approaches that adapt to available time
• **Skill Constraints**: Recommendations that match user capabilities
• **Technology Constraints**: Solutions that work with available technology
• **Organizational Constraints**: Approaches that fit organizational culture
• **Regulatory Constraints**: Solutions that comply with relevant regulations

🔍 **Context Monitoring and Updates**:
• **Change Detection**: Identifying when contextual factors change
• **Context Refresh**: Updating contextual understanding regularly
• **Impact Assessment**: Understanding how contextual changes affect recommendations
• **Adaptation Triggers**: Determining when to modify approaches based on context
• **Context History**: Tracking how context has evolved over time
• **Learning Integration**: Incorporating contextual learning into future responses

Helps prompts understand the bigger picture and provide more intelligent, relevant, and effective responses that are tailored to specific circumstances and constraints.`
    },

    // Advanced Features with comprehensive descriptions
    add_chain_of_thought: {
      title: "Step-by-Step Reasoning & Logical Progression",
      content: `Includes explicit reasoning processes that show how conclusions are reached, demonstrating logical thinking and problem-solving methodology.

🧠 **Chain of Thought Components**:
• **Problem Decomposition**: Breaking complex problems into manageable steps
• **Logical Progression**: Sequential reasoning from premises to conclusions
• **Evidence Integration**: Systematically incorporating relevant information
• **Assumption Identification**: Explicitly stating underlying assumptions
• **Inference Documentation**: Showing how conclusions are drawn from evidence
• **Verification Steps**: Checking reasoning validity at each stage

🔍 **Reasoning Process Elements**:
• **Initial Assessment**: Starting point analysis and problem understanding
• **Information Gathering**: Systematic collection of relevant data and evidence
• **Analysis Methodology**: Structured approaches to information analysis
• **Option Generation**: Systematic development of possible solutions
• **Evaluation Criteria**: Standards for assessing different options
• **Decision Logic**: Clear reasoning behind final recommendations

📋 **Thinking Process Documentation**:
• **Step Numbering**: Clear sequential organization of reasoning steps
• **Rationale Explanation**: Why each step is necessary and logical
• **Connection Mapping**: How each step connects to previous and subsequent steps
• **Alternative Consideration**: Exploration of alternative reasoning paths
• **Validation Checks**: Verification of reasoning validity and soundness
• **Conclusion Summary**: Clear statement of final conclusions and implications

✅ **Benefits of Chain of Thought**:
• Provides transparency in decision-making and problem-solving
• Enables understanding of underlying logic and methodology
• Supports learning and skill development in reasoning
• Builds confidence through clear, logical progression
• Enables verification and validation of conclusions
• Facilitates modification and adaptation of reasoning approaches

🎓 **Educational Value**:
• **Critical Thinking Development**: Teaching systematic thinking skills
• **Problem-Solving Methodology**: Demonstrating effective problem-solving approaches
• **Analytical Skills**: Building capabilities in analysis and evaluation
• **Logical Reasoning**: Strengthening logical thinking and argumentation
• **Decision-Making Framework**: Providing structured decision-making approaches
• **Metacognitive Awareness**: Understanding thinking about thinking

🔧 **Implementation Features**:
• **Clear Step Identification**: Each reasoning step is clearly marked and explained
• **Logical Connectors**: Explicit connections between reasoning steps
• **Evidence Citations**: References to supporting information and data
• **Assumption Statements**: Clear identification of underlying assumptions
• **Alternative Paths**: Exploration of different reasoning approaches
• **Validation Methods**: Techniques for checking reasoning validity

🎯 **Reasoning Types Included**:
• **Deductive Reasoning**: Drawing specific conclusions from general principles
• **Inductive Reasoning**: Developing general principles from specific observations
• **Abductive Reasoning**: Finding the best explanation for available evidence
• **Analogical Reasoning**: Drawing conclusions based on similarities and parallels
• **Causal Reasoning**: Understanding cause-and-effect relationships
• **Probabilistic Reasoning**: Working with uncertainty and likelihood

📊 **Quality Assurance for Reasoning**:
• **Logic Validation**: Ensuring reasoning follows valid logical patterns
• **Evidence Verification**: Confirming supporting evidence is accurate and relevant
• **Assumption Testing**: Evaluating the validity of underlying assumptions
• **Consistency Checking**: Ensuring reasoning is internally consistent
• **Completeness Assessment**: Verifying all necessary steps are included
• **Clarity Evaluation**: Ensuring reasoning is clear and understandable

🌟 **Advanced Reasoning Features**:
• **Multi-Perspective Analysis**: Considering multiple viewpoints in reasoning
• **Uncertainty Management**: Handling ambiguity and incomplete information
• **Recursive Reasoning**: Applying reasoning to reasoning processes themselves
• **Collaborative Reasoning**: Integrating multiple sources of reasoning
• **Dynamic Reasoning**: Adapting reasoning as new information becomes available
• **Meta-Reasoning**: Reasoning about reasoning processes and quality

Particularly valuable for complex problem-solving, analytical tasks, and educational applications where understanding the reasoning process is as important as the final conclusions.`
    },

    include_self_reflection: {
      title: "Metacognitive Elements & Process Evaluation",
      content: `Adds self-assessment and reflection components for continuous improvement, learning, and metacognitive development.

🪞 **Self-Reflection Categories**:
• **Process Reflection**: Evaluating the effectiveness of methods and approaches
• **Outcome Reflection**: Assessing the quality and success of results
• **Learning Reflection**: Understanding what was learned and how
• **Decision Reflection**: Evaluating the quality of decisions made
• **Skill Reflection**: Assessing skill development and areas for improvement
• **Strategy Reflection**: Evaluating the effectiveness of strategies used

🎯 **Metacognitive Components**:
• **Self-Awareness**: Understanding one's own thinking processes and patterns
• **Self-Monitoring**: Tracking progress and performance during tasks
• **Self-Evaluation**: Assessing the quality of work and thinking
• **Self-Regulation**: Adjusting approaches based on reflection and feedback
• **Self-Questioning**: Asking probing questions about processes and outcomes
• **Self-Improvement**: Identifying and implementing improvements

📋 **Reflection Prompts and Questions**:
• **Process Questions**: How effective were the methods used?
• **Quality Questions**: How well do the results meet the intended objectives?
• **Learning Questions**: What new insights or skills were developed?
• **Challenge Questions**: What difficulties were encountered and how were they addressed?
• **Alternative Questions**: What other approaches might have been more effective?
• **Future Questions**: How can this experience inform future work?

✅ **Benefits of Self-Reflection**:
• Encourages continuous learning and improvement
• Builds metacognitive awareness and thinking skills
• Improves future performance through learning from experience
• Increases self-awareness and personal development
• Supports adaptive thinking and flexibility
• Enhances critical evaluation and assessment skills

🔧 **Implementation Methods**:
• **Structured Reflection**: Systematic approaches to reflection and evaluation
• **Reflection Templates**: Frameworks for organizing reflective thinking
• **Progress Tracking**: Methods for monitoring development and improvement
• **Feedback Integration**: Incorporating external feedback into reflection
• **Goal Setting**: Using reflection to set future objectives and targets
• **Action Planning**: Developing specific plans for improvement

🎓 **Learning Enhancement Features**:
• **Learning Journals**: Structured approaches to documenting learning
• **Skill Assessment**: Methods for evaluating skill development
• **Knowledge Mapping**: Understanding how knowledge has grown and changed
• **Competency Tracking**: Monitoring development of specific competencies
• **Growth Documentation**: Recording progress and achievements
• **Challenge Analysis**: Understanding and learning from difficulties

📊 **Reflection Quality Indicators**:
• **Depth**: How thoroughly are processes and outcomes examined?
• **Honesty**: How accurately are strengths and weaknesses assessed?
• **Insight**: What new understanding or awareness is gained?
• **Actionability**: How effectively does reflection lead to improvement?
• **Integration**: How well is reflection integrated with ongoing work?
• **Growth**: How much development and improvement results from reflection?

🌟 **Advanced Reflection Techniques**:
• **Critical Incident Analysis**: Deep examination of significant events or decisions
• **Perspective Taking**: Viewing situations from multiple angles and viewpoints
• **Assumption Questioning**: Challenging underlying beliefs and assumptions
• **Pattern Recognition**: Identifying recurring patterns in thinking and behavior
• **Systems Thinking**: Understanding how different elements interact and influence each other
• **Future Scenario Planning**: Using reflection to anticipate and prepare for future challenges

🔍 **Reflection Integration Strategies**:
• **Regular Reflection Cycles**: Building reflection into regular work rhythms
• **Milestone Reflection**: Reflecting at key project or learning milestones
• **Problem-Based Reflection**: Using challenges as opportunities for reflection
• **Peer Reflection**: Incorporating collaborative reflection and feedback
• **Continuous Improvement**: Using reflection to drive ongoing enhancement
• **Documentation and Sharing**: Recording and sharing reflective insights

Encourages users to think about their thinking, continuously improve their approaches, and develop stronger metacognitive and self-regulation skills.`
    },

    add_multi_perspective: {
      title: "Multiple Viewpoints & Diverse Analytical Frameworks",
      content: `Incorporates different stakeholder perspectives, alternative analytical frameworks, and diverse approaches for comprehensive understanding.

👥 **Stakeholder Perspectives Included**:
• **User Perspectives**: Different types of end users and their needs
• **Business Perspectives**: Organizational and commercial considerations
• **Technical Perspectives**: Engineering and technical implementation viewpoints
• **Management Perspectives**: Leadership and strategic considerations
• **Regulatory Perspectives**: Compliance and legal considerations
• **Community Perspectives**: Broader social and community impacts

🔍 **Analytical Framework Diversity**:
• **Quantitative Analysis**: Data-driven, numerical approaches
• **Qualitative Analysis**: Interpretive, contextual approaches
• **Systems Analysis**: Holistic, interconnected viewpoints
• **Historical Analysis**: Temporal and evolutionary perspectives
• **Comparative Analysis**: Cross-case and benchmarking approaches
• **Scenario Analysis**: Future-oriented and possibility-focused perspectives

🌐 **Perspective Categories**:
• **Cultural Perspectives**: Different cultural approaches and values
• **Disciplinary Perspectives**: Various academic and professional disciplines
• **Experiential Perspectives**: Different levels and types of experience
• **Generational Perspectives**: Different age groups and generational viewpoints
• **Geographic Perspectives**: Regional and international considerations
• **Economic Perspectives**: Different economic situations and priorities

✅ **Benefits of Multi-Perspective Approach**:
• Provides more comprehensive understanding of complex issues
• Reduces bias and blind spots in analysis and decision-making
• Accommodates diverse stakeholder needs and interests
• Improves solution robustness and acceptance
• Enhances creativity and innovation through diverse thinking
• Builds empathy and understanding of different viewpoints

📊 **Perspective Integration Methods**:
• **Stakeholder Mapping**: Identifying and analyzing different stakeholder groups
• **Perspective Matrix**: Systematic comparison of different viewpoints
• **Consensus Building**: Finding common ground among diverse perspectives
• **Conflict Resolution**: Managing disagreements between different viewpoints
• **Synthesis Techniques**: Combining insights from multiple perspectives
• **Priority Balancing**: Weighing different perspectives appropriately

🔧 **Implementation Strategies**:
• **Perspective Identification**: Systematic identification of relevant viewpoints
• **Voice Representation**: Ensuring each perspective is fairly represented
• **Bias Recognition**: Acknowledging and addressing perspective biases
• **Integration Frameworks**: Methods for combining diverse viewpoints
• **Dialogue Facilitation**: Encouraging productive exchange between perspectives
• **Synthesis Documentation**: Recording how different perspectives are integrated

🎯 **Multi-Perspective Applications**:
• **Problem Definition**: Understanding problems from multiple angles
• **Solution Development**: Creating solutions that work for different stakeholders
• **Risk Assessment**: Identifying risks from various perspectives
• **Impact Analysis**: Understanding effects on different groups and contexts
• **Decision Making**: Making decisions that consider multiple viewpoints
• **Communication**: Presenting information in ways that resonate with different audiences

🌟 **Advanced Perspective Techniques**:
• **Perspective Rotation**: Systematically shifting between different viewpoints
• **Devil's Advocate**: Deliberately challenging dominant perspectives
• **Perspective Layering**: Building understanding through multiple perspective layers
• **Cross-Perspective Validation**: Using different perspectives to validate conclusions
• **Perspective Evolution**: Understanding how perspectives change over time
• **Meta-Perspective Analysis**: Analyzing the perspectives themselves

📋 **Perspective Quality Assurance**:
• **Representation Completeness**: Are all relevant perspectives included?
• **Voice Authenticity**: Are perspectives accurately and fairly represented?
• **Balance Assessment**: Is appropriate weight given to different viewpoints?
• **Bias Recognition**: Are perspective biases acknowledged and addressed?
• **Integration Effectiveness**: How well are different perspectives synthesized?
• **Stakeholder Validation**: Do stakeholders recognize their perspectives?

🔍 **Perspective Research Methods**:
• **Stakeholder Interviews**: Direct engagement with different perspective holders
• **Literature Review**: Academic and professional sources from different disciplines
• **Case Study Analysis**: Learning from different perspective applications
• **Expert Consultation**: Engaging experts from different fields and backgrounds
• **Community Engagement**: Involving broader community perspectives
• **Cross-Cultural Research**: Understanding cultural differences in perspectives

Provides more comprehensive understanding by considering multiple valid viewpoints, reducing bias, and creating solutions that work for diverse stakeholders and contexts.`
    },

    include_verification_steps: {
      title: "Quality Checkpoints & Validation Procedures",
      content: `Adds systematic checkpoints to confirm accuracy, completeness, quality, and success throughout processes and at completion.

✅ **Verification Categories**:
• **Accuracy Verification**: Confirming correctness and precision of information
• **Completeness Verification**: Ensuring all required elements are included
• **Quality Verification**: Assessing adherence to quality standards
• **Functionality Verification**: Confirming that solutions work as intended
• **Compliance Verification**: Ensuring adherence to requirements and regulations
• **Performance Verification**: Validating efficiency and effectiveness

🔍 **Checkpoint Types**:
• **Entry Checkpoints**: Verification before starting processes
• **Progress Checkpoints**: Validation during process execution
• **Milestone Checkpoints**: Verification at key project milestones
• **Exit Checkpoints**: Final validation before completion
• **Quality Gates**: Formal approval points requiring verification
• **Continuous Monitoring**: Ongoing verification throughout processes

📋 **Verification Methods**:
• **Inspection Procedures**: Systematic examination and evaluation
• **Testing Protocols**: Structured testing and validation procedures
• **Review Processes**: Peer and expert review methodologies
• **Validation Checklists**: Comprehensive verification criteria
• **Measurement Techniques**: Quantitative assessment and validation
• **Audit Procedures**: Formal verification and compliance checking

🎯 **Quality Assurance Integration**:
• **Quality Standards**: Clear criteria for acceptable quality levels
• **Measurement Metrics**: Specific measures for quality assessment
• **Acceptance Criteria**: Clear definitions of successful completion
• **Rejection Criteria**: Clear definitions of unacceptable outcomes
• **Improvement Triggers**: Conditions that require quality improvements
• **Documentation Requirements**: Recording verification results and decisions

✅ **Benefits of Systematic Verification**:
• Helps maintain high standards and quality throughout processes
• Catches issues early when they're easier and cheaper to fix
• Builds confidence in results and outcomes
• Supports continuous improvement through systematic feedback
• Ensures compliance with requirements and standards
• Provides objective evidence of quality and success

🔧 **Implementation Features**:
• **Verification Planning**: Systematic planning of verification activities
• **Checkpoint Scheduling**: Strategic timing of verification points
• **Criteria Definition**: Clear standards for verification assessment
• **Tool Integration**: Using appropriate tools for verification activities
• **Documentation Systems**: Recording and tracking verification results
• **Escalation Procedures**: Handling verification failures and issues

📊 **Verification Frameworks**:
• **Risk-Based Verification**: Focusing verification on highest risk areas
• **Process-Based Verification**: Systematic verification of process steps
• **Outcome-Based Verification**: Focusing on final results and deliverables
• **Stakeholder-Based Verification**: Including stakeholder validation and acceptance
• **Compliance-Based Verification**: Ensuring regulatory and standard compliance
• **Performance-Based Verification**: Validating efficiency and effectiveness

🌟 **Advanced Verification Techniques**:
• **Multi-Level Verification**: Verification at multiple levels of detail
• **Cross-Verification**: Using multiple methods to verify the same elements
• **Independent Verification**: Using external parties for objective verification
• **Automated Verification**: Using tools and systems for systematic verification
• **Statistical Verification**: Using statistical methods for quality assessment
• **Continuous Verification**: Ongoing verification throughout processes

🔍 **Verification Quality Indicators**:
• **Coverage**: Are all important elements verified?
• **Rigor**: Is verification thorough and systematic?
• **Objectivity**: Is verification unbiased and objective?
• **Timeliness**: Is verification conducted at appropriate times?
• **Effectiveness**: Does verification successfully identify issues?
• **Efficiency**: Is verification conducted efficiently without waste?

📋 **Verification Documentation**:
• **Verification Plans**: Systematic planning of verification activities
• **Verification Results**: Documentation of verification findings
• **Issue Tracking**: Recording and managing verification issues
• **Corrective Actions**: Documenting responses to verification failures
• **Verification Reports**: Summarizing verification activities and results
• **Improvement Recommendations**: Suggestions for verification process improvements

Helps maintain high standards, catch issues early, and build confidence in results through systematic quality assurance and validation procedures.`
    },

    add_iterative_refinement: {
      title: "Progressive Improvement & Continuous Enhancement",
      content: `Includes processes for continuous enhancement and optimization through multiple iterations, feedback integration, and progressive improvement.

🔄 **Iterative Process Components**:
• **Baseline Establishment**: Setting initial standards and starting points
• **Improvement Cycles**: Systematic cycles of enhancement and refinement
• **Feedback Integration**: Incorporating feedback into improvement processes
• **Progress Measurement**: Tracking improvement over time
• **Goal Adjustment**: Adapting objectives based on learning and results
• **Continuous Optimization**: Ongoing enhancement and refinement

📈 **Refinement Methodologies**:
• **Plan-Do-Check-Act Cycles**: Systematic improvement methodology
• **Agile Iteration**: Short, focused improvement cycles
• **Kaizen Approach**: Continuous, incremental improvement philosophy
• **Design Iteration**: Iterative design and development processes
• **Performance Tuning**: Systematic optimization of performance
• **Quality Enhancement**: Progressive improvement of quality standards

🎯 **Improvement Focus Areas**:
• **Process Refinement**: Improving methods and procedures
• **Quality Enhancement**: Raising quality standards and outcomes
• **Efficiency Optimization**: Improving speed and resource utilization
• **Effectiveness Improvement**: Enhancing goal achievement and success
• **User Experience Enhancement**: Improving usability and satisfaction
• **Innovation Integration**: Incorporating new ideas and approaches

✅ **Benefits of Iterative Refinement**:
• Enables ongoing improvement and adaptation based on experience
• Supports learning and skill development through practice
• Accommodates changing requirements and circumstances
• Builds better solutions through progressive enhancement
• Reduces risk through incremental improvement and validation
• Maintains competitiveness through continuous evolution

🔧 **Implementation Strategies**:
• **Iteration Planning**: Systematic planning of improvement cycles
• **Feedback Collection**: Gathering input for improvement decisions
• **Change Management**: Managing improvement implementation
• **Progress Tracking**: Monitoring improvement over time
• **Success Measurement**: Evaluating improvement effectiveness
• **Learning Integration**: Incorporating lessons learned into future iterations

📊 **Refinement Metrics**:
• **Improvement Rate**: Speed of enhancement and optimization
• **Quality Progression**: Improvement in quality measures over time
• **Efficiency Gains**: Improvements in resource utilization and speed
• **User Satisfaction**: Enhancement in user experience and satisfaction
• **Goal Achievement**: Progress toward objectives and targets
• **Innovation Integration**: Incorporation of new ideas and approaches

🌟 **Advanced Refinement Techniques**:
• **Multi-Dimensional Improvement**: Simultaneous improvement across multiple areas
• **Predictive Refinement**: Anticipating future improvement needs
• **Collaborative Refinement**: Engaging multiple stakeholders in improvement
• **Data-Driven Refinement**: Using analytics and data for improvement decisions
• **Experimental Refinement**: Testing and validating improvement approaches
• **Systematic Refinement**: Using structured methodologies for improvement

🔍 **Refinement Quality Assurance**:
• **Improvement Validation**: Confirming that changes actually improve outcomes
• **Regression Prevention**: Ensuring improvements don't cause other problems
• **Stakeholder Acceptance**: Ensuring improvements meet stakeholder needs
• **Sustainability Assessment**: Confirming improvements can be maintained
• **Cost-Benefit Analysis**: Evaluating improvement value and investment
• **Risk Assessment**: Understanding risks associated with changes

📋 **Refinement Documentation**:
• **Improvement Plans**: Systematic planning of refinement activities
• **Change Logs**: Recording all improvements and modifications
• **Progress Reports**: Tracking and reporting improvement progress
• **Lessons Learned**: Documenting insights and learning from improvement
• **Best Practices**: Capturing effective improvement approaches
• **Future Roadmaps**: Planning ongoing improvement and enhancement

🎯 **Refinement Applications**:
• **Product Development**: Iterative improvement of products and services
• **Process Optimization**: Continuous enhancement of workflows and procedures
• **Skill Development**: Progressive improvement of capabilities and competencies
• **System Enhancement**: Ongoing improvement of systems and technologies
• **Strategy Refinement**: Continuous improvement of strategies and approaches
• **Relationship Building**: Progressive improvement of partnerships and collaboration

Enables ongoing improvement and adaptation based on results, feedback, and changing requirements while building better solutions through progressive enhancement and learning.`
    },

    include_fallback_strategies: {
      title: "Backup Plans & Contingency Procedures",
      content: `Provides alternative approaches and backup plans when primary methods fail, are unavailable, or encounter unexpected obstacles.

🛡️ **Fallback Strategy Categories**:
• **Technical Fallbacks**: Alternative technical approaches and solutions
• **Resource Fallbacks**: Backup options when resources are unavailable
• **Timeline Fallbacks**: Alternative approaches for time constraints
• **Skill Fallbacks**: Options for different skill levels and capabilities
• **Environmental Fallbacks**: Alternatives for different conditions
• **Quality Fallbacks**: Acceptable alternatives when optimal solutions aren't possible

🔄 **Contingency Planning Elements**:
• **Risk Assessment**: Identifying potential failure points and obstacles
• **Alternative Identification**: Developing multiple backup approaches
• **Trigger Conditions**: Defining when to activate fallback strategies
• **Transition Procedures**: Smooth switching between primary and fallback approaches
• **Resource Requirements**: Understanding needs for alternative approaches
• **Success Criteria**: Defining acceptable outcomes for fallback strategies

📋 **Backup Plan Types**:
• **Primary Alternatives**: Full-featured alternative approaches
• **Simplified Alternatives**: Reduced-scope options when full solutions aren't possible
• **Temporary Workarounds**: Short-term solutions while working toward permanent fixes
• **Emergency Procedures**: Rapid response options for critical situations
• **Degraded Mode Operations**: Reduced functionality options during constraints
• **Recovery Procedures**: Methods for returning to normal operations

✅ **Benefits of Fallback Strategies**:
• Ensures resilience and reliability when primary approaches fail
• Provides options and flexibility when facing constraints
• Reduces risk and impact of failures and obstacles
• Maintains progress and momentum despite setbacks
• Builds confidence through comprehensive contingency planning
• Supports adaptation to changing circumstances and requirements

🎯 **Fallback Implementation Features**:
• **Trigger Identification**: Clear conditions for activating fallbacks
• **Rapid Deployment**: Quick implementation of alternative approaches
• **Resource Allocation**: Efficient use of available resources for alternatives
• **Quality Maintenance**: Maintaining acceptable quality with alternative approaches
• **Communication Protocols**: Informing stakeholders about fallback activation
• **Recovery Planning**: Strategies for returning to preferred approaches

🔧 **Contingency Development Process**:
• **Scenario Planning**: Identifying potential failure and constraint scenarios
• **Alternative Research**: Investigating possible backup approaches
• **Feasibility Assessment**: Evaluating viability of alternative options
• **Resource Planning**: Understanding resource needs for alternatives
• **Testing and Validation**: Confirming fallback strategies work effectively
• **Documentation and Training**: Ensuring fallbacks can be implemented when needed

📊 **Fallback Quality Criteria**:
• **Availability**: Are fallback options readily available when needed?
• **Feasibility**: Can alternatives be implemented with available resources?
• **Effectiveness**: Do fallbacks achieve acceptable outcomes?
• **Speed**: Can alternatives be deployed quickly when needed?
• **Cost**: Are fallback options economically viable?
• **Quality**: Do alternatives maintain acceptable quality standards?

🌟 **Advanced Fallback Features**:
• **Layered Fallbacks**: Multiple levels of backup options
• **Adaptive Fallbacks**: Strategies that adjust to specific failure conditions
• **Collaborative Fallbacks**: Alternatives that leverage partnerships and collaboration
• **Innovative Fallbacks**: Creative alternatives that may improve on original approaches
• **Predictive Fallbacks**: Anticipating and preparing for likely failure scenarios
• **Learning Fallbacks**: Using fallback experiences to improve primary approaches

🔍 **Fallback Monitoring and Management**:
• **Readiness Assessment**: Ensuring fallback strategies remain viable
• **Trigger Monitoring**: Watching for conditions that require fallback activation
• **Performance Tracking**: Monitoring effectiveness of activated fallbacks
• **Improvement Integration**: Using fallback experiences to improve strategies
• **Resource Maintenance**: Keeping fallback resources available and current
• **Communication Management**: Keeping stakeholders informed about fallback status

📋 **Fallback Documentation**:
• **Contingency Plans**: Detailed documentation of fallback strategies
• **Activation Procedures**: Step-by-step guides for implementing fallbacks
• **Resource Inventories**: Lists of resources available for alternative approaches
• **Contact Information**: Key contacts for fallback implementation
• **Decision Trees**: Guidance for choosing among multiple fallback options
• **Recovery Procedures**: Plans for returning to normal operations

🎯 **Fallback Applications**:
• **Project Management**: Backup plans for project risks and obstacles
• **Technology Implementation**: Alternative technical approaches and solutions
• **Resource Management**: Options when preferred resources aren't available
• **Timeline Management**: Alternatives for time-constrained situations
• **Quality Assurance**: Acceptable alternatives when optimal quality isn't achievable
• **Crisis Management**: Emergency procedures for critical situations

Ensures resilience and reliability by providing options when primary approaches fail, maintaining progress despite obstacles, and reducing risk through comprehensive contingency planning.`
    },

    // Special Features
    enable_markdown: {
      title: "Enhanced Formatting & Visual Presentation",
      content: `Uses markdown syntax for improved visual presentation, organization, and professional appearance.

📝 **Markdown Features Available**:
• **Headers and Subheaders**: Hierarchical organization (##, ###, ####)
• **Lists and Bullet Points**: Organized information (-, *, numbered lists)
• **Code Blocks**: Formatted code examples (\`\`\`)
• **Emphasis**: Text styling (*italic*, **bold**, ***bold italic***)
• **Tables**: Structured data presentation
• **Horizontal Rules**: Section separators (---)
• **Links**: Hyperlinks to resources and references
• **Blockquotes**: Highlighted quotes and important information

🎨 **Visual Enhancement Benefits**:
• **Improved Readability**: Better visual hierarchy and organization
• **Professional Appearance**: Clean, modern formatting
• **Enhanced Scanning**: Easy identification of key information
• **Better Organization**: Clear section breaks and structure
• **Emphasis Control**: Strategic highlighting of important points
• **Code Presentation**: Professional formatting for technical content

📊 **Formatting Applications**:
• **Documentation**: Professional technical and user documentation
• **Instructional Content**: Clear, well-organized learning materials
• **Reference Materials**: Easy-to-navigate reference guides
• **Reports**: Professional presentation of findings and analysis
• **Proposals**: Well-formatted business and project proposals
• **Communication**: Clear, professional written communication

⚠️ **Important Considerations**:
• **Compatibility**: Ensure target environment supports markdown rendering
• **Fallback Planning**: Consider how content appears without markdown support
• **Consistency**: Maintain consistent markdown usage throughout
• **Accessibility**: Ensure markdown enhances rather than hinders accessibility
• **Platform Differences**: Different platforms may render markdown differently
• **User Familiarity**: Consider whether users are familiar with markdown syntax

🔧 **Implementation Guidelines**:
• **Strategic Usage**: Use markdown to enhance rather than complicate content
• **Consistent Style**: Maintain uniform markdown patterns throughout
• **Accessibility Focus**: Ensure markdown improves rather than hinders accessibility
• **Testing**: Verify markdown renders correctly in target environments
• **Documentation**: Provide guidance on markdown usage when necessary
• **Graceful Degradation**: Ensure content remains useful without markdown rendering

✅ **Best Practices for Markdown Usage**:
• **Header Hierarchy**: Use consistent header levels for logical organization
• **List Formatting**: Choose appropriate list types for different content
• **Code Formatting**: Use proper code blocks for technical examples
• **Table Usage**: Create clear, well-organized tables for structured data
• **Emphasis Balance**: Use emphasis strategically without overuse
• **Link Management**: Ensure all links are functional and relevant

🎯 **Quality Assurance for Markdown**:
• **Rendering Testing**: Verify appearance across different platforms
• **Accessibility Validation**: Ensure markdown enhances accessibility
• **Consistency Checking**: Maintain uniform markdown usage patterns
• **Fallback Validation**: Confirm content works without markdown rendering
• **User Testing**: Validate that markdown improves user experience
• **Performance Impact**: Ensure markdown doesn't negatively affect performance

📋 **Markdown Documentation Standards**:
• **Style Guide**: Consistent markdown usage patterns and conventions
• **Template Library**: Standard markdown templates for common content types
• **Quality Checklist**: Verification criteria for markdown content
• **Training Materials**: Guidance for users working with markdown content
• **Tool Recommendations**: Suggested tools for creating and editing markdown
• **Troubleshooting Guide**: Common markdown issues and solutions

⚠️ **Note**: Disabled by default for maximum compatibility. Enable only when markdown rendering is available in your target environment and when the enhanced formatting will provide clear benefits to users.

Markdown can significantly improve the visual presentation and organization of content, but should only be used when the target environment supports it and when it genuinely enhances rather than complicates the user experience.`
    }
  };

  // Enhanced smart presets with better descriptions and tooltips
  const smartPresets = [
    {
      id: 'balanced',
      name: 'Balanced Enhancement',
      description: 'Comprehensive improvement with examples and best practices',
      tooltip: {
        title: "Balanced Enhancement Preset",
        content: `A well-rounded enhancement suitable for most use cases.

🎯 **What it includes**:
• Practical examples and demonstrations
• Industry best practices and proven methods
• Improved clarity and readability
• Enhanced specificity and precision
• Better structural organization
• Quality validation methods

✅ **Best for**: General-purpose prompts, mixed audiences, versatile applications

This preset applies the most commonly beneficial enhancements without over-specializing for any particular use case. It provides a solid foundation of improvements that work well across different domains and contexts.`
      },
      icon: FaRocket,
      params: {
        include_examples: true,
        include_best_practices: true,
        improve_clarity: true,
        enhance_specificity: true,
        strengthen_structure: true
      }
    },
    {
      id: 'professional',
      name: 'Professional Focus',
      description: 'Business-ready with constraints and validation',
      tooltip: {
        title: "Professional Focus Preset",
        content: `Optimized for professional and business environments.

🏢 **Professional features**:
• Clear constraints and boundaries
• Quality validation methods
• Industry best practices
• Professional tone and language
• Reliable, consistent results
• Compliance considerations

✅ **Best for**: Business applications, corporate use, professional documentation, compliance-sensitive environments

Ensures outputs meet professional standards and business requirements while maintaining credibility and reliability in organizational contexts.`
      },
      icon: FaShieldAlt,
      params: {
        include_constraints: true,
        include_validation: true,
        include_best_practices: true,
        tone: 'professional' as const
      }
    },
    {
      id: 'creative',
      name: 'Creative Boost',
      description: 'Enhanced creativity with multiple perspectives',
      tooltip: {
        title: "Creative Boost Preset",
        content: `Maximizes creative potential and innovative thinking.

🎨 **Creative enhancements**:
• Boosted creative thinking and innovation
• Multiple perspective analysis
• Alternative approach suggestions
• Friendly, encouraging tone
• Innovation-focused methodology
• Inspiration and ideation support

✅ **Best for**: Creative projects, brainstorming, design work, artistic endeavors, innovation challenges

Encourages out-of-the-box thinking and novel solutions while providing supportive, inspiration-rich guidance for creative work.`
      },
      icon: FaLightbulb,
      params: {
        boost_creativity: true,
        add_multi_perspective: true,
        include_alternatives: true,
        tone: 'friendly' as const
      }
    },
    {
      id: 'technical',
      name: 'Technical Deep-dive',
      description: 'Detailed technical analysis with troubleshooting',
      tooltip: {
        title: "Technical Deep-dive Preset",
        content: `Comprehensive technical coverage with problem-solving focus.

🔧 **Technical features**:
• Detailed troubleshooting guidance
• Error handling and recovery procedures
• Step-by-step reasoning processes
• Technical tone and precision
• In-depth analytical approach
• Systematic problem-solving methodology

✅ **Best for**: Technical documentation, software development, engineering tasks, complex problem-solving

Provides thorough technical depth and systematic problem-solving methodology for demanding technical applications.`
      },
      icon: FaCode,
      params: {
        include_troubleshooting: true,
        add_error_handling: true,
        include_reasoning: true,
        tone: 'technical' as const
      }
    }
  ];

  const applyPreset = (preset: typeof smartPresets[0]) => {
    onParamsChange(preset.params);
  };

  return (
    <div className={`rounded-xl border transition-colors duration-300
                   ${darkMode 
                     ? 'bg-dark-800 border-dark-600' 
                     : 'bg-white border-gray-200'}`}>
      
      <div className={`p-6 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className={`text-xl font-bold transition-colors duration-300
                           ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
              Configuration Settings
            </h2>
            <Tooltip 
              title="Configuration Overview"
              content={`Configure how your prompt will be upgraded with comprehensive control over enhancement options.

🎛️ **Two modes available**:
• **Smart Mode**: Quick presets for common use cases
• **Manual Mode**: Detailed control over all options

Choose the mode that best fits your needs and expertise level. Smart mode provides curated combinations of settings optimized for specific scenarios, while manual mode gives you granular control over every aspect of the enhancement process.`}
              darkMode={darkMode}
              size="large"
            >
              <FaInfoCircle className={`text-sm cursor-help transition-colors duration-200 hover:text-blue-500
                                      ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
            </Tooltip>
          </div>
          <button
            onClick={onToggleAdvanced}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium
                      transition-all duration-200 hover:scale-105
                      ${darkMode
                        ?'hover:bg-dark-600 text-dark-300'
                        : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <FaCog />
            <span>{showAdvanced ? 'Simple View' : 'Advanced View'}</span>
            {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      <div className="p-6">
        {configurationMode === 'smart' ? (
          // Smart Mode - Enhanced preset-based configuration
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <h3 className={`text-lg font-semibold flex items-center space-x-2
                               ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                  <FaBrain className="text-blue-500" />
                  <span>Smart Presets</span>
                </h3>
                <Tooltip 
                  title="Smart Presets Guide"
                  content={`Pre-configured enhancement combinations optimized for common use cases.

🚀 **How it works**:
• Each preset applies multiple settings automatically
• Optimized combinations based on best practices
• Saves time while ensuring quality results
• Can be customized further if needed

Choose the preset that best matches your intended use case, then fine-tune with additional settings if desired. These presets represent proven combinations that work well for their intended purposes.`}
                  darkMode={darkMode}
                  size="large"
                >
                  <FaInfoCircle className={`text-sm cursor-help transition-colors duration-200 hover:text-blue-500
                                          ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                </Tooltip>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {smartPresets.map((preset) => (
                  <Tooltip 
                    key={preset.id} 
                    title={preset.tooltip.title}
                    content={preset.tooltip.content} 
                    darkMode={darkMode} 
                    position="bottom"
                    size="large"
                    maxWidth="max-w-lg w-80"
                  >
                    <button
                      onClick={() => applyPreset(preset)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200
                                hover:scale-105 hover:shadow-lg group
                                ${darkMode
                                  ? 'border-dark-600 bg-dark-700 hover:border-blue-500'
                                  : 'border-gray-200 bg-gray-50 hover:border-blue-400'}`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <preset.icon className={`text-lg transition-colors duration-200 group-hover:scale-110
                                               ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h4 className={`font-semibold ${darkMode ? 'text-dark-100' : 'text-gray-900'}`}>
                          {preset.name}
                        </h4>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                        {preset.description}
                      </p>
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* Essential Settings with Enhanced Tooltips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className={`text-sm font-medium
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Purpose
                  </label>
                  <Tooltip 
                    title={tooltipContent.purpose.title}
                    content={tooltipContent.purpose.content} 
                    darkMode={darkMode}
                    size="xlarge"
                    maxWidth="max-w-2xl w-[32rem]"
                  >
                    <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                            ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                  </Tooltip>
                </div>
                <select
                  value={upgradeParams.purpose}
                  onChange={(e) => handleParamChange('purpose', e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200
                            focus:outline-none focus:ring-2
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                >
                  <option value="code_generation">Code Generation</option>
                  <option value="analysis">Analysis</option>
                  <option value="documentation">Documentation</option>
                  <option value="creative">Creative</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className={`text-sm font-medium
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Target Audience
                  </label>
                  <Tooltip 
                    title={tooltipContent.target_audience.title}
                    content={tooltipContent.target_audience.content} 
                    darkMode={darkMode}
                    size="xlarge"
                    maxWidth="max-w-2xl w-[32rem]"
                  >
                    <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                            ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                  </Tooltip>
                </div>
                <select
                  value={upgradeParams.target_audience}
                  onChange={(e) => handleParamChange('target_audience', e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200
                            focus:outline-none focus:ring-2
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className={`text-sm font-medium
                                   ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    Detail Level
                  </label>
                  <Tooltip 
                    title={tooltipContent.detail_level.title}
                    content={tooltipContent.detail_level.content} 
                    darkMode={darkMode}
                    size="xlarge"
                    maxWidth="max-w-2xl w-[32rem]"
                  >
                    <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                            ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                  </Tooltip>
                </div>
                <select
                  value={upgradeParams.detail_level}
                  onChange={(e) => handleParamChange('detail_level', e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200
                            focus:outline-none focus:ring-2
                            ${darkMode
                              ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                >
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          // Manual Mode - Full control with comprehensive tooltips
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Core Settings */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className={`text-lg font-semibold flex items-center space-x-2
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    <FaCog className="text-purple-500" />
                    <span>Core Settings</span>
                  </h3>
                  <Tooltip 
                    title="Core Settings Guide"
                    content={`Fundamental configuration options that define the basic approach and style of your prompt upgrade.

🎯 **These settings form the foundation**:
• **Purpose**: What the prompt is designed to achieve
• **Tone**: How it communicates with users
• **Audience**: Who will be using it
• **Detail Level**: How much information to include

All other enhancements build upon these core decisions. Choose these carefully as they influence all other aspects of the upgrade process.`}
                    darkMode={darkMode}
                    size="large"
                    maxWidth="max-w-lg w-96"
                  >
                    <FaInfoCircle className={`text-sm cursor-help transition-colors duration-200 hover:text-purple-500
                                            ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                  </Tooltip>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <label className={`text-sm font-medium
                                         ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          Purpose
                        </label>
                        <Tooltip 
                          title={tooltipContent.purpose.title}
                          content={tooltipContent.purpose.content} 
                          darkMode={darkMode}
                          size="xlarge"
                          maxWidth="max-w-2xl w-[32rem]"
                        >
                          <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                                  ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                        </Tooltip>
                      </div>
                      <select
                        value={upgradeParams.purpose}
                        onChange={(e) => handleParamChange('purpose', e.target.value as any)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200
                                  focus:outline-none focus:ring-2
                                  ${darkMode
                                    ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                      >
                        <option value="code_generation">Code Generation</option>
                        <option value="analysis">Analysis</option>
                        <option value="documentation">Documentation</option>
                        <option value="debugging">Debugging</option>
                        <option value="creative">Creative</option>
                        <option value="general">General</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <label className={`text-sm font-medium
                                         ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          Tone
                        </label>
                        <Tooltip 
                          title={tooltipContent.tone.title}
                          content={tooltipContent.tone.content} 
                          darkMode={darkMode}
                          size="xlarge"
                          maxWidth="max-w-2xl w-[32rem]"
                        >
                          <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                                  ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                        </Tooltip>
                      </div>
                      <select
                        value={upgradeParams.tone}
                        onChange={(e) => handleParamChange('tone', e.target.value as any)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200
                                  focus:outline-none focus:ring-2
                                  ${darkMode
                                    ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                      >
                        <option value="professional">Professional</option>
                        <option value="technical">Technical</option>
                        <option value="friendly">Friendly</option>
                        <option value="casual">Casual</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Enhancements */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className={`text-lg font-semibold flex items-center space-x-2
                                 ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                    <FaRocket className="text-green-500" />
                    <span>Quick Enhancements</span>
                  </h3>
                  <Tooltip 
                    title="Quick Enhancement Guide"
                    content={`Common enhancement options that can significantly improve your prompt's effectiveness with a single toggle.

⚡ **These are the most impactful improvements**:
• **Add Examples**: Makes concepts concrete and actionable
• **Best Practices**: Ensures professional-grade results
• **Improve Clarity**: Removes confusion and ambiguity
• **More Specific**: Provides precise, measurable guidance

Start with these for immediate improvement, then explore advanced options for fine-tuning. These enhancements provide the biggest impact with minimal complexity.`}
                    darkMode={darkMode}
                    size="large"
                    maxWidth="max-w-lg w-96"
                  >
                    <FaInfoCircle className={`text-sm cursor-help transition-colors duration-200 hover:text-green-500
                                            ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                  </Tooltip>
                </div>
                
                <div className="space-y-3">
                  {[
                    { key: 'include_examples', label: 'Add Examples', icon: FaBookOpen, tooltip: tooltipContent.include_examples },
                    { key: 'include_best_practices', label: 'Best Practices', icon: FaShieldAlt, tooltip: tooltipContent.include_best_practices },
                    { key: 'improve_clarity', label: 'Improve Clarity', icon: FaLightbulb, tooltip: tooltipContent.improve_clarity },
                    { key: 'enhance_specificity', label: 'More Specific', icon: FaUsers, tooltip: tooltipContent.enhance_specificity }
                  ].map(({ key, label, icon: Icon, tooltip }) => (
                    <div key={key} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200
                                              hover:bg-opacity-50 hover:scale-105 group
                                              ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <div className="flex items-center space-x-3">
                        <Icon className={`text-sm transition-colors duration-200 group-hover:text-blue-500
                                        ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          {label}
                        </span>
                        <Tooltip 
                          title={tooltip.title}
                          content={tooltip.content} 
                          darkMode={darkMode}
                          size="large"
                          maxWidth="max-w-lg w-96"
                        >
                          <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                                  ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                        </Tooltip>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !(upgradeParams[key as keyof UpgradeParameters] as boolean))}
                        className="text-lg transition-all duration-200 hover:scale-110"
                      >
                        {upgradeParams[key as keyof UpgradeParameters] as boolean ? (
                          <FaToggleOn className="text-blue-500" />
                        ) : (
                          <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/*Advanced Settings (Collapsible) with Comprehensive Tooltips */}
        {showAdvanced && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <h3 className={`text-lg font-semibold flex items-center space-x-2
                             ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
                <FaTools className="text-indigo-500" />
                <span>Advanced Options</span>
              </h3>
              <Tooltip 
                title="Advanced Options Guide"
                content={`Detailed configuration options for fine-tuning your prompt upgrade.

🔧 **Advanced controls include**:
• **Content Features**: What to include in your prompt
• **Quality Improvements**: How to enhance existing content
• **Advanced Features**: Sophisticated enhancement techniques
• **Formatting Options**: Visual presentation controls

These settings provide precise control over specific aspects of the enhancement process. Use them to customize the upgrade to your exact requirements and create highly specialized prompts.`}
                darkMode={darkMode}
                size="large"
                maxWidth="max-w-lg w-96"
              >
                <FaInfoCircle className={`text-sm cursor-help transition-colors duration-200 hover:text-indigo-500
                                        ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
              </Tooltip>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Content Features */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <h4 className={`font-medium flex items-center space-x-2
                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    <FaCubes className="text-blue-500" />
                    <span>Content Features</span>
                  </h4>
                  <Tooltip 
                    title="Content Features"
                    content={`Additional content elements that can be included in your upgraded prompt.

📦 **Content features add**:
• **Constraints**: Rules and limitations
• **Context**: Background information
• **Alternatives**: Multiple approaches
• **Reasoning**: Logic explanations
• **Troubleshooting**: Problem-solving help
• **Warnings**: Risk alerts
• **Resources**: Additional references
• **Validation**: Quality checks

These elements make prompts more comprehensive, reliable, and effective by providing additional support and guidance.`}
                    darkMode={darkMode}
                    size="medium"
                    maxWidth="max-w-md w-80"
                  >
                    <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                            ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'include_constraints', label: 'Constraints', tooltip: tooltipContent.include_constraints },
                    { key: 'include_context', label: 'Context', tooltip: tooltipContent.include_context },
                    { key: 'include_alternatives', label: 'Alternatives', tooltip: tooltipContent.include_alternatives },
                    { key: 'include_reasoning', label: 'Reasoning', tooltip: tooltipContent.include_reasoning },
                    { key: 'include_troubleshooting', label: 'Troubleshooting', tooltip: tooltipContent.include_troubleshooting },
                    { key: 'include_warnings', label: 'Warnings', tooltip: tooltipContent.include_warnings },
                    { key: 'include_resources', label: 'Resources', tooltip: tooltipContent.include_resources },
                    { key: 'include_validation', label: 'Validation', tooltip: tooltipContent.include_validation }
                  ].map(({ key, label, tooltip }) => (
                    <div key={key} className={`flex items-center justify-between cursor-pointer p-2 rounded transition-all duration-200
                                             hover:bg-opacity-50 group
                                             ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          {label}
                        </span>
                        <Tooltip 
                          title={tooltip.title}
                          content={tooltip.content} 
                          darkMode={darkMode}
                          size="large"
                          maxWidth="max-w-lg w-96"
                        >
                          <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                                  ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                        </Tooltip>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !(upgradeParams[key as keyof UpgradeParameters] as boolean))}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        {upgradeParams[key as keyof UpgradeParameters] as boolean ? (
                          <FaToggleOn className="text-blue-500" />
                        ) : (
                          <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Improvements */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <h4 className={`font-medium flex items-center space-x-2
                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    <FaStar className="text-yellow-500" />
                    <span>Quality Improvements</span>
                  </h4>
                  <Tooltip 
                    title="Quality Improvements"
                    content={`Enhancements that improve the overall quality and effectiveness of your prompt.

⭐ **Quality improvements**:
• **Structure**: Better organization
• **Flow**: Smoother transitions
• **Readability**: Easier to understand
• **Coherence**: Logical consistency
• **Error Handling**: Failure management
• **Edge Cases**: Boundary conditions
• **Context Awareness**: Situational intelligence

These refinements make prompts more professional, reliable, and effective in real-world usage.`}
                    darkMode={darkMode}
                    size="medium"
                    maxWidth="max-w-md w-80"
                  >
                    <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-yellow-500
                                            ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'strengthen_structure', label: 'Structure', tooltip: tooltipContent.strengthen_structure },
                    { key: 'improve_flow', label: 'Flow', tooltip: tooltipContent.improve_flow },
                    { key: 'enhance_readability', label: 'Readability', tooltip: tooltipContent.enhance_readability },
                    { key: 'improve_coherence', label: 'Coherence', tooltip: tooltipContent.improve_coherence },
                    { key: 'add_error_handling', label: 'Error Handling', tooltip: tooltipContent.add_error_handling },
                    { key: 'add_edge_cases', label: 'Edge Cases', tooltip: tooltipContent.add_edge_cases },
                    { key: 'add_context_awareness', label: 'Context Awareness', tooltip: tooltipContent.add_context_awareness }
                  ].map(({ key, label, tooltip }) => (
                    <div key={key} className={`flex items-center justify-between cursor-pointer p-2 rounded transition-all duration-200
                                             hover:bg-opacity-50 group
                                             ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          {label}
                        </span>
                        <Tooltip 
                          title={tooltip.title}
                          content={tooltip.content} 
                          darkMode={darkMode}
                          size="large"
                          maxWidth="max-w-lg w-96"
                        >
                          <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                                  ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                        </Tooltip>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !(upgradeParams[key as keyof UpgradeParameters] as boolean))}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        {upgradeParams[key as keyof UpgradeParameters] as boolean ? (
                          <FaToggleOn className="text-blue-500" />
                        ) : (
                          <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Features */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <h4 className={`font-medium flex items-center space-x-2
                                 ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                    <FaCompass className="text-purple-500" />
                    <span>Advanced Features</span>
                  </h4>
                  <Tooltip 
                    title="Advanced Features"
                    content={`Sophisticated enhancement techniques for complex use cases.

🧠 **Advanced features include**:
• **Chain of Thought**: Step-by-step reasoning
• **Multi-Perspective**: Multiple viewpoints
• **Verification**: Quality checkpoints
• **Creativity**: Innovation boosters
• **Self Reflection**: Metacognitive elements
• **Iterative Refinement**: Continuous improvement
• **Fallback Strategies**: Backup plans

These features add sophisticated capabilities for demanding applications and complex problem-solving scenarios.`}
                    darkMode={darkMode}
                    size="medium"
                    maxWidth="max-w-md w-80"
                  >
                    <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-purple-500
                                            ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'add_chain_of_thought', label: 'Chain of Thought', tooltip: tooltipContent.add_chain_of_thought },
                    { key: 'add_multi_perspective', label: 'Multi-Perspective', tooltip: tooltipContent.add_multi_perspective },
                    { key: 'include_verification_steps', label: 'Verification', tooltip: tooltipContent.include_verification_steps },
                    { key: 'boost_creativity', label: 'Creativity', tooltip: tooltipContent.boost_creativity },
                    { key: 'include_self_reflection', label: 'Self Reflection', tooltip: tooltipContent.include_self_reflection },
                    { key: 'add_iterative_refinement', label: 'Iterative Refinement', tooltip: tooltipContent.add_iterative_refinement },
                    { key: 'include_fallback_strategies', label: 'Fallback Strategies', tooltip: tooltipContent.include_fallback_strategies }
                  ].map(({ key, label, tooltip }) => (
                    <div key={key} className={`flex items-center justify-between cursor-pointer p-2 rounded transition-all duration-200
                                             hover:bg-opacity-50 group
                                             ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                          {label}
                        </span>
                        <Tooltip 
                          title={tooltip.title}
                          content={tooltip.content} 
                          darkMode={darkMode}
                          size="large"
                          maxWidth="max-w-lg w-96"
                        >
                          <FaInfoCircle className={`text-xs cursor-help transition-colors duration-200 hover:text-blue-500
                                                  ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
                        </Tooltip>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleParamChange(key as keyof UpgradeParameters, !(upgradeParams[key as keyof UpgradeParameters] as boolean))}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        {upgradeParams[key as keyof UpgradeParameters] as boolean ? (
                          <FaToggleOn className="text-blue-500" />
                        ) : (
                          <FaToggleOff className={darkMode ? 'text-dark-500' : 'text-gray-400'} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Markdown Setting - Special Section with Enhanced Tooltip */}
            <div className={`mt-6 p-4 rounded-lg border-2 border-dashed transition-all duration-200
                           hover:border-solid hover:shadow-md
                           ${darkMode ? 'border-yellow-600 bg-yellow-900/10 hover:bg-yellow-900/20' : 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h4 className={`text-sm font-semibold flex items-center space-x-2
                                 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    <FaMarkdown />
                    <span>Formatting Options</span>
                  </h4>
                  <Tooltip 
                    title={tooltipContent.enable_markdown.title}
                    content={tooltipContent.enable_markdown.content}
                    darkMode={darkMode}
                    position="right"
                    size="xlarge"
                    maxWidth="max-w-2xl w-[32rem]"
                  >
                    <FaInfoCircle className={`text-sm cursor-help transition-colors duration-200 hover:text-yellow-500
                                            ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </Tooltip>
                </div>
                <button
                  type="button"
                  onClick={() => handleParamChange('enable_markdown', !upgradeParams.enable_markdown)}
                  className="text-lg transition-transform duration-200 hover:scale-110"
                >
                  {upgradeParams.enable_markdown ? (
                    <FaToggleOn className="text-yellow-500" />
                  ) : (
                    <FaToggleOff className={darkMode ? 'text-yellow-600' : 'text-yellow-400'} />
                  )}
                </button>
              </div>
              <div className="mt-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  Enable Markdown Formatting
                </span>
                <p className={`text-xs mt-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  Disabled by default for compatibility. Enable to use markdown syntax in upgraded prompts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Instructions with Enhanced Tooltip */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className={`text-lg font-semibold flex items-center space-x-2
                           ${darkMode ? 'text-dark-200' : 'text-gray-800'}`}>
              <FaLanguage className="text-indigo-500" />
              <span>Custom Instructions</span>
            </h3>
            <Tooltip 
              title="Custom Instructions Guide"
              content={`Add specific, personalized instructions that will be incorporated into the upgrade process.

✍️ **Use custom instructions for**:
• Specific requirements not covered by standard options
• Domain-specific constraints or preferences
• Unique formatting or style requirements
• Special considerations for your use case
• Additional context about your intended application

These instructions are integrated directly into the upgrade prompt to ensure your specific needs are addressed and your unique requirements are met.`}
              darkMode={darkMode}
              size="large"
              maxWidth="max-w-lg w-96"
            >
              <FaInfoCircle className={`text-sm cursor-help transition-colors duration-200 hover:text-indigo-500
                                      ${darkMode ? 'text-dark-400' : 'text-gray-500'}`} />
            </Tooltip>
          </div>
          <textarea
            value={customInstructions}
            onChange={(e) => onCustomInstructionsChange(e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
                      focus:outline-none focus:ring-2 resize-none text-sm
                      ${darkMode
                        ? 'bg-dark-700 border-dark-500 text-dark-100 focus:ring-blue-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            placeholder="Add specific instructions for the upgrade process. These will be incorporated into the upgrade prompt to provide additional context and requirements..."
          />
        </div>
      </div>
    </div>
  );
};

export default SmartConfiguration;