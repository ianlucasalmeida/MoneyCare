import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  List,
  Surface,
  Switch,
  Text,
  useTheme
} from 'react-native-paper';

// Tipos e interfaces
type SettingItem = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  hasSwitch?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  badge?: string;
  dangerous?: boolean;
  disabled?: boolean;
};

type SettingSection = {
  id: string;
  title: string;
  description?: string;
  items: SettingItem[];
};

// Configurações da tela
const SETTINGS_CONFIG = {
  card: {
    elevation: 2,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  animations: {
    duration: 200,
  },
};

const SettingsScreen = () => {
  const theme = useTheme();
  
  // Estados
  const [isNotificationsOn, setIsNotificationsOn] = React.useState(true);
  const [isDarkTheme, setIsDarkTheme] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);
  const [autoBackup, setAutoBackup] = React.useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(false);

  // Handlers
  const handleThemeChange = (value: boolean) => {
    setIsDarkTheme(value);
    // TODO: Implementar mudança de tema global
    Alert.alert(
      'Tema',
      `Tema ${value ? 'escuro' : 'claro'} será aplicado na próxima abertura do app.`,
      [{ text: 'OK' }]
    );
  };

  const handleBiometricChange = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Autenticação Biométrica',
        'Deseja ativar a autenticação por impressão digital ou Face ID?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Ativar', 
            onPress: () => setBiometricEnabled(true)
          }
        ]
      );
    } else {
      setBiometricEnabled(false);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpar Cache',
      'Isso removerá dados temporários do aplicativo. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar limpeza de cache
            Alert.alert('Cache', 'Cache limpo com sucesso!');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Seus dados serão exportados em formato CSV. Pode levar alguns momentos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar',
          onPress: () => {
            // TODO: Implementar exportação
            Alert.alert('Exportação', 'Dados exportados com sucesso!');
          }
        }
      ]
    );
  };

  // Configuração das seções de settings
  const settingSections: SettingSection[] = [
    {
      id: 'appearance',
      title: 'Aparência',
      description: 'Personalize a aparência do aplicativo',
      items: [
        {
          id: 'darkTheme',
          title: 'Tema Escuro',
          description: 'Usar interface escura',
          icon: 'theme-light-dark',
          hasSwitch: true,
          value: isDarkTheme,
          onValueChange: handleThemeChange,
        },
        {
          id: 'language',
          title: 'Idioma',
          description: 'Português (Brasil)',
          icon: 'translate',
          onPress: () => Alert.alert('Idioma', 'Funcionalidade em desenvolvimento'),
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Gerencie suas preferências de notificação',
      items: [
        {
          id: 'pushNotifications',
          title: 'Notificações Push',
          description: 'Receber alertas importantes',
          icon: 'bell',
          hasSwitch: true,
          value: isNotificationsOn,
          onValueChange: setIsNotificationsOn,
        },
        {
          id: 'emailNotifications',
          title: 'Notificações por Email',
          description: 'Resumos semanais e atualizações',
          icon: 'email',
          onPress: () => Alert.alert('Email', 'Configuração de email em desenvolvimento'),
        },
      ],
    },
    {
      id: 'security',
      title: 'Segurança e Privacidade',
      description: 'Proteja suas informações pessoais',
      items: [
        {
          id: 'biometric',
          title: 'Autenticação Biométrica',
          description: Platform.OS === 'ios' ? 'Touch ID / Face ID' : 'Impressão Digital',
          icon: Platform.OS === 'ios' ? 'face-recognition' : 'fingerprint',
          hasSwitch: true,
          value: biometricEnabled,
          onValueChange: handleBiometricChange,
        },
        {
          id: 'autoLock',
          title: 'Bloqueio Automático',
          description: 'Bloquear após 5 minutos de inatividade',
          icon: 'lock',
          onPress: () => Alert.alert('Bloqueio', 'Configuração de bloqueio em desenvolvimento'),
        },
        {
          id: 'privacy',
          title: 'Política de Privacidade',
          description: 'Ver nossa política de privacidade',
          icon: 'shield-account',
          onPress: () => Alert.alert('Privacidade', 'Abrindo política de privacidade...'),
        },
      ],
    },
    {
      id: 'data',
      title: 'Dados e Armazenamento',
      description: 'Gerencie seus dados e backups',
      items: [
        {
          id: 'autoBackup',
          title: 'Backup Automático',
          description: 'Backup diário na nuvem',
          icon: 'cloud-upload',
          hasSwitch: true,
          value: autoBackup,
          onValueChange: setAutoBackup,
        },
        {
          id: 'exportData',
          title: 'Exportar Dados',
          description: 'Baixar seus dados em CSV',
          icon: 'download',
          onPress: handleExportData,
        },
        {
          id: 'clearCache',
          title: 'Limpar Cache',
          description: 'Liberar espaço de armazenamento',
          icon: 'delete-sweep',
          onPress: handleClearCache,
          dangerous: true,
        },
      ],
    },
    {
      id: 'about',
      title: 'Sobre',
      description: 'Informações do aplicativo',
      items: [
        {
          id: 'version',
          title: 'Versão do App',
          description: '1.2.0 (Build 24)',
          icon: 'information',
          badge: 'Atual',
        },
        {
          id: 'analytics',
          title: 'Análise de Uso',
          description: 'Ajudar a melhorar o app',
          icon: 'chart-line',
          hasSwitch: true,
          value: analyticsEnabled,
          onValueChange: setAnalyticsEnabled,
        },
        {
          id: 'support',
          title: 'Suporte',
          description: 'Obter ajuda e reportar problemas',
          icon: 'help-circle',
          onPress: () => Alert.alert('Suporte', 'Abrindo central de suporte...'),
        },
        {
          id: 'rate',
          title: 'Avaliar App',
          description: 'Deixe sua avaliação na loja',
          icon: 'star',
          onPress: () => Alert.alert('Avaliação', 'Redirecionando para a loja...'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem, isLast: boolean) => {
    const itemStyle = {
      backgroundColor: item.dangerous 
        ? `${theme.colors.error}08` 
        : theme.colors.surface,
    };

    return (
      <React.Fragment key={item.id}>
        <List.Item
          title={item.title}
          description={item.description}
          titleStyle={[
            styles.itemTitle,
            item.dangerous && { color: theme.colors.error }
          ]}
          descriptionStyle={styles.itemDescription}
          style={[styles.listItem, itemStyle]}
          disabled={item.disabled}
          onPress={item.onPress}
          left={() => item.icon ? (
            <List.Icon 
              icon={item.icon} 
              color={item.dangerous ? theme.colors.error : theme.colors.primary}
              style={styles.itemIcon}
            />
          ) : null}
          right={() => (
            <View style={styles.itemRight}>
              {item.badge && (
                <Chip 
                  mode="outlined" 
                  compact 
                  style={styles.badge}
                  textStyle={styles.badgeText}
                >
                  {item.badge}
                </Chip>
              )}
              {item.hasSwitch ? (
                <Switch 
                  value={item.value} 
                  onValueChange={item.onValueChange}
                  disabled={item.disabled}
                />
              ) : item.onPress ? (
                <IconButton 
                  icon="chevron-right" 
                  size={20}
                  iconColor={theme.colors.onSurfaceVariant}
                />
              ) : null}
            </View>
          )}
        />
        {!isLast && <Divider style={styles.divider} />}
      </React.Fragment>
    );
  };

  const renderSection = (section: SettingSection) => (
    <Surface key={section.id} style={styles.sectionCard} elevation={2}>
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          {section.title}
        </Text>
        {section.description && (
          <Text variant="bodySmall" style={styles.sectionDescription}>
            {section.description}
          </Text>
        )}
      </View>
      
      <View style={styles.sectionContent}>
        {section.items.map((item, index) => 
          renderSettingItem(item, index === section.items.length - 1)
        )}
      </View>
    </Surface>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header com informações do usuário */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Configurações
            </Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>
              Personalize sua experiência
            </Text>
          </Card.Content>
        </Card>

        {/* Seções de configurações */}
        {settingSections.map(renderSection)}

        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            icon="backup-restore" 
            style={styles.actionButton}
            onPress={() => Alert.alert('Restaurar', 'Funcionalidade em desenvolvimento')}
          >
            Restaurar Backup
          </Button>
          
          <Button 
            mode="outlined" 
            icon="factory" 
            style={[styles.actionButton, styles.dangerButton]}
            buttonColor={`${theme.colors.error}15`}
            textColor={theme.colors.error}
            onPress={() => Alert.alert(
              'Reset', 
              'Isso apagará todos os dados. Tem certeza?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Reset', style: 'destructive' }
              ]
            )}
          >
            Resetar Aplicativo
          </Button>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 32,
  },

  // Header
  headerCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
  },
  headerContent: {
    paddingVertical: 20,
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    opacity: 0.7,
  },

  // Seções
  sectionCard: {
    ...SETTINGS_CONFIG.card,
    marginBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    opacity: 0.7,
  },
  sectionContent: {
    paddingBottom: 8,
  },

  // Items
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 64,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  itemIcon: {
    marginRight: 8,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Badge
  badge: {
    height: 24,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 14,
  },

  // Divider
  divider: {
    marginLeft: 72, // Alinha com o texto após o ícone
    marginRight: 16,
  },

  // Botões de ação
  actionButtons: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
  },
  dangerButton: {
    borderColor: 'rgba(176, 0, 32, 0.5)',
  },
});

export default SettingsScreen;