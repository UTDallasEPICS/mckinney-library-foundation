// composables/useEmails.js
import { ref } from 'vue';

export const useEmails = () => {
    const isLoading = ref(false);
    const error = ref(null);

    // Email templates
    const emailTemplates = {
        thankYou: {
            subject: "Thank You for Your Support",
            body: "Dear [Donor Name],\n\nWe wanted to express our sincere gratitude for your generous donation to the McKinney Public Library Foundation. Your support makes a meaningful difference in our community.\n\nThanks to supporters like you, we can continue to enhance library services, expand our collections, and provide educational programs for all ages.\n\nWith appreciation,\nThe McKinney Public Library Foundation Team"
        },
        event: {
            subject: "Invitation: Upcoming Library Event",
            body: "Dear [Donor Name],\n\nAs a valued supporter of the McKinney Public Library Foundation, we'd like to invite you to our upcoming event: [Event Name].\n\nDate: [Event Date]\nTime: [Event Time]\nLocation: [Event Location]\n\nWe hope you can join us for this special occasion.\n\nBest regards,\nThe McKinney Public Library Foundation Team"
        },
        newsletter: {
            subject: "McKinney Library Foundation Monthly Update",
            body: "Dear [Donor Name],\n\nWe're pleased to share our monthly newsletter highlighting recent library accomplishments and upcoming initiatives.\n\nRECENT HIGHLIGHTS:\n- [Highlight 1]\n- [Highlight 2]\n- [Highlight 3]\n\nUPCOMING EVENTS:\n- [Event 1]\n- [Event 2]\n\nThank you for your continued support!\n\nSincerely,\nThe McKinney Public Library Foundation Team"
        },
        fundraising: {
            subject: "Help Us Reach Our Goal",
            body: "Dear [Donor Name],\n\nWe're launching a new fundraising campaign to support [Campaign Purpose].\n\nOur goal is to raise $[Amount] by [Date]. Your past support has been invaluable, and we hope you'll consider contributing to this important initiative.\n\nTo donate, visit our website or contact us directly.\n\nThank you for helping us make a difference!\n\nGratefully,\nThe McKinney Public Library Foundation Team"
        }
    };

    // Get a specific template
    const getTemplate = (templateKey) => {
        return emailTemplates[templateKey] || null;
    };

    // Get all available templates
    const getTemplates = () => {
        return emailTemplates;
    };

    // Process template with donor data
    const processTemplate = (template, donor) => {
        let processedSubject = template.subject;
        let processedBody = template.body;

        // Replace donor name placeholder
        if (donor) {
            processedSubject = processedSubject.replace(/\[Donor Name\]/g, donor.name);
            processedBody = processedBody.replace(/\[Donor Name\]/g, donor.name);
        }

        return {
            subject: processedSubject,
            body: processedBody
        };
    };

    // Send emails to multiple donors
    const sendMassEmail = async (recipients, emailData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // In a real app, this would call your API endpoint
            // For now, we'll mock the API call
            console.log('Sending email to:', recipients);
            console.log('Email subject:', emailData.subject);
            console.log('Email body:', emailData.body);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Return success response
            return {
                success: true,
                message: `Email sent to ${recipients.length} recipient(s)`,
                timestamp: new Date().toISOString()
            };
        } catch (err) {
            error.value = err.message || 'Failed to send emails';
            console.error('Email sending error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Replace all placeholders in a template
    const fillTemplate = (template, replacements) => {
        let processedSubject = template.subject;
        let processedBody = template.body;

        // Replace each placeholder with its value
        Object.entries(replacements).forEach(([key, value]) => {
            const placeholder = `[${key}]`;
            const regex = new RegExp(placeholder, 'g');

            processedSubject = processedSubject.replace(regex, value);
            processedBody = processedBody.replace(regex, value);
        });

        return {
            subject: processedSubject,
            body: processedBody
        };
    };

    return {
        isLoading,
        error,
        getTemplate,
        getTemplates,
        processTemplate,
        sendMassEmail,
        fillTemplate
    };
};